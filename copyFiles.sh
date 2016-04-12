echo "-- Copy files to public dir --"
cp index-m.html public/index-m.html
cp index.html public/index.html
cp js/main.js public/js/main.js
cp sw.js public/sw.js
cp cache-polyfill.js public/cache-polyfill.js
cp css/main.css public/css/main.css
cp -R img/ public/img/
cp manifest.json public/manifest.json

echo "-- push it to firebase --"
firebase deploy
