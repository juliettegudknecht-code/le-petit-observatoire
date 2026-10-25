#!/bin/sh
# Copies the site's files (one folder up) into www/, which Capacitor bundles into the app.
# The site itself is never edited here. Run: npm run sync
set -e
cd "$(dirname "$0")"
rm -rf www && mkdir www
for f in index.html privacy.html style.css data.js app.js games.js manifest.webmanifest icon-512.png icon-180.png; do
  cp "../$f" www/
done
echo "Copied $(ls www | wc -l | tr -d ' ') files into www/"
