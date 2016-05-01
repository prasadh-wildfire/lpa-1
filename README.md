## Overview

An LPA web app(s).
We got 3 Apps:

* [Admin Web App](https://lpa-1.firebaseapp.com/) - Used by the organizers to set the schedule for the mentors and startups. 
  * The mentors and attendees emails/names should be added to the system so they will be 'white listed'.
  * The startups' details should be filled.
  * The schedule per day of the LPA.

* [Mentor Web App](https://lpa-1.firebaseapp.com/index-mentor.html) - Used by the mentors to see who they are going to meet (=which startup) and when.
  * The mentor should sign-in with their gmail account and fill their personal details.
  * Next, she can see what is the schedule per day.

* [Attendee Web App](https://lpa-1.firebaseapp.com/startup.html) - Used by the startups/attendees to see who is the lovely mentor that will work with them.
  * The attendee should sign-in with their gmail account and fill their personal details.
  * Next, she can see what is the schedule per day.

-----

## Issue / Bug ?
Please use: [Open an issue](https://github.com/greenido/lpa-1/issues)

-----
## ToDos

### General
* [ ] Add build process (Gulp) - copy, minify, image optimization etc'.
* [ ] Add unit tests

### PWA
* [ ] Use Service workers for caching and local saving of notes.
* [ ] Add manifest.
* [ ] Add push notifications on special notes that you mark with "todo".

### Sing-in
* [x] Enable an option to use Google

### Help 
* [ ] Add mailto explanation for Chrome: chrome://settings/handlers
* [ ] Add an introJS to show the function/power user options in the app.

-----

![LPA PWA](https://lpa-1.firebaseapp.com/img/lion-hd.jpeg)
####A lion runs the fastest when he is hungry. 
-----

## Data Model

### Mentor 
* Key: email (but with '-' instead of '.')
* Name
* Email
* Domain (ux, tech, product, marketing)
* Expertise - free text
* LinkedIn Url
* Personal website Url 
* Country
* City
* Picture Url

### Startup
* Key: Name
* Short description
* Long description
* Country
* City
* Fund raised
* Number of employees 
* Date founded. 
* Logo Url
* Team photo Url
* Application Video Url
* Marketing Video Url
* Patient History File Url

### Attendee
* Key: email (but with '-' instead of '.')
* Name
* Email
* Startup he is working at
* Pic Url
* Linkedin Url

### Session
* Key: unixTime + startup name + mentor
* Startup Name
* Mentor
* Meeting Location
* Date
* Time
* Length

