(function() {
    $(".save-alert").hide();
    $("#spin").hide();
    var unixTime = Math.floor(Date.now() / 1000);

    //
    // start the connection with firebase DB
    //
    var ref = new Firebase("https://lpa-1.firebaseio.com");
    authUserData = null;
    ref.onAuth(function(authData) {
        if (authData) {
            authUserData = authData;
            localStorage.setItem("lpa1-authData", JSON.stringify(authData) );
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            $("#login-form").hide();
            $("#logout-div").html("<form class='navbar-form navbar-right' role='form'><button id='logout-but' class='btn btn-success'>Logout</button> </form>");
            readMentors(authData);
        } else {
            console.log("User is logged out");
            $("#login-form").show();
            $("#logout-div").html("");
        }
    });

    //
    // Save mentors
    //
    $("#form-save-mentor").click(function() {
        // validation - TODO: take it out to a function
        if ($("#form-name-field").val().length < 2) {
            $("#nameError").html("Please give a name - So you could remember it in the future!");
            $("#nameError").removeClass("sr-only");
            $("#nameError").addClass("alert");
            $("#form-name-field").focus();
            setTimeout(function() {
              $("#nameError").removeClass("alert");
              $("#nameError").addClass("sr-only");
            }, 1500);
            return;
        }
        
        var emailRegEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
        if ($("#form-email-field").val().length < 2) {
            alert("Please give a email - So we could spam you.");
            $("#form-email-field").focus();
            return;
        }
        console.log("saving to Firebase: " + $("#form-name-field").val() + " , " +
            $("#form-email-field").val());
        var curUnixTime = new Date().getTime();
        var disTime = new Date().toJSON().slice(0, 21);
        var name = $("#form-name-field").val();
        var emailKey = $("#form-email-field").val();
        var tel = $("#form-phone-field").val();
        //var authData = JSON.parse(localStorage.getItem("lpa1-authData") );

        ref.child("mentors").child(tel).set({
                name: name,
                email: emailKey,
                phone: tel,
                country: $("#form-country-field").val(),
                city: $("#form-city-field").val(),
                domain: $("#form-domain-select option:selected").text(),
                expertise: $("#form-expertise").val(),
                linkedin: $("#form-linkedin-url").val(),
                site: $("#form-personal-url").val(),
                pic: $("#form-pic-url").val(),
                comments: $("#form-comments").val(),
                unixTime: curUnixTime,
                date: disTime
            }, function(error) {
                if (error) {
                    alert("Data could not be saved :( Details: " + error);
                } else {
                  console.log(name+ " saved!"); 
                  $(".save-alert").show();
                  setTimeout(function() {
                      $(".save-alert").hide();
                  }, 1500);
                }
            })
            // TODO - confirmation on the save
    });

    //
    function readMentors(authData) {
        var readRef = new Firebase("https://lpa-1.firebaseio.com/mentors/");
        readRef.orderByKey().on("value", function(snapshot) {
            //console.log("The mentors: " + JSON.stringify(snapshot.val()));
            $("#mentors-list").html("");
            snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key();
                var mentorData = childSnapshot.val();
                console.log("key: " + key + " data: " + mentorData);
                $("#mentors-list").append(
                    '<div class="panel panel-primary"> <div class="panel-heading"> <h3 class="panel-title">' +
                    mentorData.name + " ( " + mentorData.phone + " )" + '<button type="button" class="remove-mentor btn" aria-label="Close" data-key="' + key + '"> <span aria-hidden="true">&times;</span></button>' +
                    '</h3> </div> <div class="panel-body mentor-edit" data-key="' + key + '"> ' + mentorData.email + '<br>' +
                    mentorData.domain + '<br>'+ mentorData.expertise + ' </div> </div>'
                );
            });
        });
    }

    //
    $("#logout-but").click(function() {
        ref.unauth();
        return false;
    });

    // enable to edit mentors from the list
    $('body').on('click', '.mentor-edit', function(event) {
        console.log("TODO: edit mentor with key: " + unixTime);
    });

    // enable removing mentors
    $('body').on('click', '.remove-mentor', function(event) {
      var key = this.dataset.key;
      console.log("going to delete mentor with key: TODO");
      var fredRef = new Firebase('https://lpa-1.firebaseio.com/mentors/' + key);
      var onComplete = function(error) {
          if (error) {
              console.log('Synchronization failed');
          } else {
              console.log('Synchronization succeeded - mentor was removed');
              $("#mentors-list").html('<div id="loading-mentors"><h2><i class="fa fa-spinner fa-spin"></i> </h2></div>');
              readMentors(authUserData);
          }
      };
      fredRef.remove(onComplete);
    });

    //
    // Sign in
    //
    $("#sign-in-but").click(function() {
        $("#spin").show();
        var u_email = $("#email").val();
        var u_passwd = $("#passwd").val();
        ref.authWithPassword({
            email: u_email,
            password: u_passwd
        }, function(error, authData) {
            $("#spin").hide();
            if (error) {
                console.log("Login Failed!", error);
                $("#err-modal").modal('show');
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        });
        return false;
    });

    //////////////////////////////////////////////////////////////////////////////////
    // utils
    //////////////////////////////////////////////////////////////////////////////////

    //
    function timeConverter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + '/' + month + '/' + year + ' - ' + hour + ':' + min + ':' + sec;
        return time;
    }

    // check for online / lie-fi / offline
    window.addEventListener("offline", function(e) {
        console.log('You are OFFLINE');
        $("#online-status").html(" Offline");
    }, false);

    window.addEventListener("online", function(e) {
        console.log("we are back online!");
        $("#online-status").html(" Online");
    }, false);
})();
