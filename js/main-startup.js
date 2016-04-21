//
// JS for the attendee web app
// Author: Ido Green 
// Date: 4/2016
//
(function() {
  $(".save-alert").hide();
  $("#alert-warning-sign-in").hide();
  $("#spin").hide();

  var startupNameList = [];
  var curAttendeeEmail = "";
  var curAttendeeStartup = "";

  // AUTH fun
  // start the connection with firebase DB
  //
  var ref = new Firebase("https://lpa-1.firebaseio.com");
  authUserData = null;
  ref.onAuth(function(authData) {
    if (authData) {
      authUserData = authData;
      localStorage.setItem("lpa1-g-authData", JSON.stringify(authData));
      $("#sc-reload-button").prop('disabled', false);
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
      $("#login-form").html("<img src='" + authData.google.profileImageURL + "' class='g-mentor-logo' alt='mentor logo' />");
      $("#logout-div").html("<form class='navbar-form navbar-right' role='form'><button id='logout-but' class='btn btn-success'>Logout</button> </form>");

      curAttendeeEmail = authData.google.email;
      // so we could use it as firebase key
      curAttendeeEmail = curAttendeeEmail.replace(".", "-");
      fetchAttendee(curAttendeeEmail);

      // init our attendee with what we have from google-login
      $("#logout-but").text("Logout " + authData.google.displayName);

      readStartups(authData);
      readAttendees(authData);
    } else {
      console.log("Attendee is logged out");
      logoutUI();
    }
  });

  //
  //
  //
  function logoutUI() {
    $("#sc-reload-button").prop('disabled', true);
    $("#logout-div").html("");
    $("#login-form").html('<button type="submit" id="google-sign-in-but" class="btn btn-success">Sign in</button> <span id="spin"><i class="fa fa-spinner fa-spin"></i></span>');
    $("#spin").hide();
  }
  //
  // Sign in user/password
  //
  $("#google-sign-in-but").click(function() {
    $("#spin").show();
    ref.authWithOAuthPopup("google", function(error, authData) {
      $("#spin").hide();
      if (error) {
        console.log("Login Failed!", error);
        $("#err-modal").modal('show');
      } else {
        $("#sc-reload-button").prop('disabled', false);
        console.log("Authenticated successfully with payload:", authData);
      }
    }, {
      scope: "email"
    });
    return false;
  });

  //
  // logout
  //
  $("#logout-but").click(function() {
    ref.unauth();
    logoutUI();
    return false;
  });


  //////////////////////////////////////////////////////////////////////////////
  // Fetch schedule
  //////////////////////////////////////////////////////////////////////////////

  //
  // Reload the schedule that the attendee got (= per her startup)
  //
  $("#sc-reload-button").click(function() {
    var scDay = $("#schedule-day-1").val();
    if (scDay == null || scDay == "") {
      bootbox.alert("You must set a date in order to reload schedule. Daaa!");
      $("#schedule-day-1").focus();
      return;
    }

    var readRef = new Firebase("https://lpa-1.firebaseio.com/sessions/" + scDay + "/startups/" + curAttendeeStartup);
    readRef.orderByKey().on("value", function(snapshot) {
      var sessions = snapshot.val();
      if (sessions != null) {
        $("#sc-reload-button").text("Reload " + curAttendeeStartup);
        //console.log("The sessions: " + JSON.stringify(sessions));
        var scHtml = "";
        scHtml += '<div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title"> Comments For The Day' +
          '</h3> </div> <div class="panel-body">' + sessions.comments +
          '<p class="collapse" id="meet-details-1">More bla bla bla <br>Donec id elit non mi </p> \
          <p><a class="btn btn-default" data-toggle="collapse" data-target="#meet-details-1">Details &raquo;</a></p> \
          </div> </div>';

        // we know it's the mentors and hours
        for (var i = 0; i < sessions.mentors.length; i++) {
          scHtml += '<div class="panel panel-default"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">' +
          sessions.mentors[i][1] + ' | ' + getHourAsRange("hour-"+(i+1)) + '</h3> </div> <div class="panel-body">' +
          'todo: bla bla and comments <p class="collapse" id="meet-details-1">More bla bla bla <br>Donec id elit non mi </p> \
          <p><a class="btn btn-default" data-toggle="collapse" data-target="#meet-details-1">Details &raquo;</a></p> \
          </div> </div>';
        }
        //console.log(scHtml);
        $("#attendee-schedule-list").html(scHtml);
      } else {
        if (curAttendeeStartup == "") {
          bootbox.alert("Please check why you are not part of any startup.");
          $("#sc-reload-button").text("Reload");
        } else {
          bootbox.alert("Could not find anything for " + curAttendeeStartup + " at this date.");
        }

      }
    });

  });

  function getHourAsRange(key) {
    if (key.indexOf("1") > 0) {
      return "9:00 - 10:00";
    } else if (key.indexOf("2") > 0) {
      return "10:00 - 11:00";
    } else if (key.indexOf("3") > 0) {
      return "11:00 - 12:00";
    } else if (key.indexOf("4") > 0) {
      return "12:00 - 13:00";
    } else if (key.indexOf("5") > 0) {
      return "13:00 - 14:00";
    } else if (key.indexOf("6") > 0) {
      return "14:00 - 15:00";
    } else if (key.indexOf("7") > 0) {
      return "15:00 - 16:00";
    } else if (key.indexOf("8") > 0) {
      return "16:00 - 17:00";
    } else if (key.indexOf("9") > 0) {
      return "17:00 - 18:00";
    } else {
      return "--";
    }

  }

  //////////////////////////////////////////////////////////////////////////////
  // Startups
  //////////////////////////////////////////////////////////////////////////////

  //
  // get list of startups
  //
  function getStartupSelect() {
    var html = '<select id="att-startup-list-select" class="selectpicker" data-style="btn-info">';
    var len = startupNameList.length;
    for (var i = 0; i < len; i++) {
      html += '<option>' + startupNameList[i] + '</option>'
    }
    html += '</select>';
    return html;
  }


  //
  // read the list of startups and display it
  //
  function readStartups(authData) {
    var readRef = new Firebase("https://lpa-1.firebaseio.com/startups/");
    readRef.orderByKey().on("value", function(snapshot) {
      //console.log("The Startups: " + JSON.stringify(snapshot.val()));
      $("#startups-list").html("");
      startupNameList = [];
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key();
        startupNameList.push(key);
        var startupData = childSnapshot.val();
        var startupLogoUrl = addhttp(startupData.logo);
        //console.log("key: " + key + " data: " + startupData);
        $("#startups-list").append(
          '<div class="panel panel-primary"> <div class="panel-heading"> <h3 class="panel-title">' +
          startupData.name + " ( <img src='" + startupLogoUrl + "' class='logo-img' alt='startup logo'> )" +
          '</h3> </div> <div class="panel-body startup-edit" data-key="' + key + '"> <b>' + startupData.description + '</b><br>' +
          startupData.country + '<br>' + startupData.city + ' </div> </div>'
        );
      });
      var selHtml = getStartupSelect();
      $("#att-startup-sel-div").html("");
      $("#att-startup-sel-div").append(selHtml);
      $('#att-startup-list-select').selectpicker();
    });
  }



  //////////////////////////////////////////////////////////////////////////////
  // Mentors
  //////////////////////////////////////////////////////////////////////////////

  //
  // read the list of mentors and display it
  //
  function readMentors(authData) {
    var readRef = new Firebase("https://lpa-1.firebaseio.com/mentors/");
    readRef.orderByKey().on("value", function(snapshot) {
      //console.log("The mentors: " + JSON.stringify(snapshot.val()));
      $("#mentors-list").html("");
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key();
        var mentorData = childSnapshot.val();
        var mPicUrl = addhttp(mentorData.pic);
        //console.log("key: " + key + " data: " + mentorData);
        $("#mentors-list").append(
          '<div class="panel panel-primary"> <div class="panel-heading"> <h3 class="panel-title">' +
          mentorData.name + " ( " + mentorData.phone + " )" +
          '<button type="button" class="edit-mentor mentor-edit btn btn-info" aria-label="Edit" data-key="' + key +
          '"><span class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="remove-mentor btn btn-danger" aria-label="Close" data-key="' + key + '"> <span class="glyphicon glyphicon-remove"></span></button>' +
          '</h3> </div> <div class="panel-body mentor-edit" data-key="' + key + '"> ' + mentorData.email + '<br>' +
          '<img src="' + mPicUrl + '" class="att-pic-card" alt="mentor picture" /> ' +
          mentorData.domain + '<br>' + mentorData.expertise + ' </div> </div>'
        );
      });
    });
  }

  //
  // clear the values of the mentor
  //
  $("#form-cancel-mentor").click(function() {
    $("#form-name-field").val("");
    $("#form-email-field").val("");
    $("#form-phone-field").val("");
    $("#form-country-field").val("");
    $("#form-city-field").val("");
    $("#form-domain-select").val("UX");
    $("#form-expertise").val("");
    $("#form-linkedin-url").val("");
    $("#form-personal-url").val("");
    $("#form-pic-url").val("");
    $("#form-comments").val("");
    $("#form-name-field").focus();
    $('body').scrollTop(60);
  });

  //
  // fetch mentor data base on its key (=phone number)
  //
  function fetchAttendee(key) {
    var ref = new Firebase("https://lpa-1.firebaseio.com/attendees/" + key);
    ref.on("value", function(attSnap) {
      var att = attSnap.val();
      if (att != null) {
        console.log("Setting data for: " + JSON.stringify(att));
        curAttendeeStartup = att.startup;
        localStorage.setItem("lpa1-g-att-email", curAttendeeEmail);
        localStorage.setItem("lpa1-g-att-startup", curAttendeeStartup);
      } else {
        localStorage.removeItem("lpa1-g-att-email");
        localStorage.removeItem("lpa1-g-att-startup");
      }
    });
  }


  //////////////////////////////////////////////////////////////////////////////
  // Attendees
  //////////////////////////////////////////////////////////////////////////////

  //
  // read the list of Attendees and display it
  //
  function readAttendees(authData) {
    var readRef = new Firebase("https://lpa-1.firebaseio.com/attendees/");
    readRef.orderByKey().on("value", function(snapshot) {
      //console.log("The attendees: " + JSON.stringify(snapshot.val()));
      $("#att-list").html("");
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key();
        var attData = childSnapshot.val();
        var picUrl = addhttp(attData.pic);
        //console.log("key: " + key + " data: " + attData);
        $("#att-list").append(
          '<div class="panel panel-primary"> <div class="panel-heading"> <h3 class="panel-title">' +
          attData.name + " ( <a href='mailto:" + attData.email + "' target='_blank'>" + attData.email + "</a> )" +
          '</h3> </div> <div class="panel-body att-edit" data-key="' + key + '"> ' + attData.startup + '<br>' +
          '<img src="' + picUrl + '" class="att-pic-card" alt="attendee picture"/> <br>' + attData.linkedin + ' </div> </div>'
        );
      });
    });
  }


  //////////////////////////////////////////////////////////////////////////////////
  // Utils
  //////////////////////////////////////////////////////////////////////////////////

  //
  //
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

  //
  // check if our url contain http and if not - add it.
  //
  function addhttp(url) {
    if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    return url;
  }

  //
  // auto resize iframe for the full space it can take.
  //
  function autoResize(id) {
    var newheight;
    var newwidth;
    if (document.getElementById) {
      newheight = document.getElementById(id).contentWindow.document.body.scrollHeight;
      newwidth = document.getElementById(id).contentWindow.document.body.scrollWidth;
    }
    document.getElementById(id).height = (newheight) + "px";
    document.getElementById(id).width = (newwidth) + "px";
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
