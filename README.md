## Overview

An LPA web app
Currently it's a "Work in progress".

* [Basic version](https://lpa-1.firebaseapp.com/)

## ToDos

### PWA
* [ ] Add build process (Gulp) - copy, minify etc'.
* [ ] Use Service workers for caching and local saving of notes.
* [ ] Add manifest.
* [ ] Add push notifications on special notes that you mark with "todo".

### Sing-in
* [ ] Enable an option to use Facebook, Google, Twitter.

### Help 
* [ ] Add mailto explanation for Chrome: chrome://settings/handlers
* [ ] Add an introJS to show the funtion/power user option in the app.

-----

![LPA PWA](https://lpa-1.firebaseapp.com/img/lion-hd.jpeg)

-----

## Data 

### Mentor 
* Key: Phone
* Name
* Email
* Domain (ux, tech, product, marketing)
* Expertise - free text
* LinkedIn url
* Personal website. 
* Country
* City
* Picture url

### Startup
* Key: Name
* Short description
* Long description
* Country
* City
* Fund raised
* Number of employees 
* Date founded. 
* Logo url
* Team photo Url
* Application Video Url
* Marketing Video Url
* Patient History File Url

### Attendee
* Key: Email
* Name
* Startup he is working at
* Pic url
* Linkedin url

### Session
* Key: unixTime + startup name + mentor
* Startup Name
* Mentor
* Meeting Location
* Date
* Time
* Length

