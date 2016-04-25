## Overview

An LPA web app
Currently it's a "Work in progress".

* [Admin Web App](https://lpa-1.firebaseapp.com/)
* [Mentor Web App](https://lpa-1.firebaseapp.com/index-mentor.html)
* [Attendee Web App](https://lpa-1.firebaseapp.com/startup.html)

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
* [ ] Enable an option to use Facebook(?)
* [ ] Enable an option to use Twitter(?)

### Help 
* [ ] Add mailto explanation for Chrome: chrome://settings/handlers
* [ ] Add an introJS to show the function/power user options in the app.

-----
## Issue / Bug ?
Please use: [Open an issue](https://github.com/greenido/lpa-1/issues)

-----

![LPA PWA](https://lpa-1.firebaseapp.com/img/lion-hd.jpeg)
####A lion runs the fastest when he is hungry. 
-----

## Data Model

### Mentor 
* Key: Phone
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
* Key: Email
* Name
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

