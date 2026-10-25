#!/bin/sh
# Archives the app and uploads it to App Store Connect (TestFlight) from the command line.
# Needs: Xcode signed in to your Apple ID with a paid team, and the team ID below.
# Find the team ID at developer.apple.com/account (Membership details), ten characters like AB12CD34EF.
# Usage:  sh testflight.sh AB12CD34EF
set -e
TEAM="$1"; [ -z "$TEAM" ] && { echo "Give your Apple team ID: sh testflight.sh AB12CD34EF"; exit 1; }
cd "$(dirname "$0")"
export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
export PATH="$HOME/node-v24/bin:$PATH"
npm run sync
OUT="$PWD/build"; mkdir -p "$OUT"
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release -destination 'generic/platform=iOS' \
  -archivePath "$OUT/App.xcarchive" DEVELOPMENT_TEAM="$TEAM" -allowProvisioningUpdates archive
xcodebuild -exportArchive -archivePath "$OUT/App.xcarchive" -exportOptionsPlist ExportOptions.plist \
  -exportPath "$OUT/export" -allowProvisioningUpdates
echo "Uploaded. Watch for the processing email, then add yourself under TestFlight, Internal Testing."
