# Getting Le Petit Observatoire onto the App Store

The site in this folder is wrapped as a native iPhone app with Capacitor. The wrapper lives in `ios-app/` and the Xcode project is `ios-app/ios/App/App.xcodeproj`. The web files are copied in at build time, so editing the site is still just editing the files in this folder.

Everything below needs your Apple ID, your phone, or your credit card, so it is on you. Nothing here has been enrolled, signed in to, or paid for yet.

## One-time setup on this Mac

1. Install Xcode from the Mac App Store (free, about 12 GB, takes a while). Open it once so it can finish installing its components, then run this so the command line tools point at the full Xcode:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

2. Node. A copy of Node 24 is already unpacked at `~/node-v24` and that is what built this project. If you would rather have a normal install, download the macOS installer from https://nodejs.org (the LTS one) and run it. Either way, put it on your path before using the commands below:

```bash
export PATH=$HOME/node-v24/bin:$PATH
```

3. Enroll in the Apple Developer Program at https://developer.apple.com/programs/enroll/ with your personal Apple ID. It costs $99 a year and approval can take a day or two. You need this before the app can be signed for your own phone or uploaded.

4. In Xcode, go to Settings, Accounts, and sign in with that Apple ID. Your name should appear as a team once enrollment is approved.

## Build it and run it on your phone

1. Copy the current site into the app and open Xcode:

```bash
cd ~/Downloads/le-petit-observatoire/ios-app && export PATH=$HOME/node-v24/bin:$PATH && npm install && npm run sync && npm run open
```

Run `npm run sync` again any time you change the site. The first time Xcode opens it will download the Capacitor Swift package, which takes a minute.

2. In Xcode, click the blue App project in the left sidebar, pick the App target, open Signing and Capabilities, tick Automatically manage signing, and choose your team. The bundle identifier is already set to `com.juliettegudknecht.observatoire`. Leave it unless Apple says it is taken.

3. Plug in your iPhone, pick it as the run destination at the top, and press the play button. The first time, your phone will ask you to trust the developer under Settings, General, VPN and Device Management.

4. Test these on the phone before going any further, because they are the parts a native web view can behave differently on:
   - the radio (YouTube). If a station says the video is unavailable, that is YouTube refusing to play inside an app shell without a normal web address. The fix is to pick videos that allow embedding, and if it still refuses, tell me and we will swap the radio to open in Safari or Apple Music instead.
   - the Rappel quotidien switch on the home screen (phone only). Turn it on, allow notifications when asked, set the time a minute ahead, lock the phone, and wait for the nudge.
   - a wrong answer should buzz and a right one should tap, if haptics are on in Settings, Sounds and Haptics.
   - the speaker button (French audio). It uses the iPhone's built-in French voice. If it is silent, add a French voice under Settings, Accessibility, Spoken Content, Voices.
   - highlight a word to translate. It calls Google and MyMemory over the network, so it needs a connection.
   - close the app fully and reopen it. Your streak and progress should still be there.

## Upload to App Store Connect

1. Go to https://appstoreconnect.apple.com, My Apps, the plus button, New App. Platform iOS, name "Le Petit Observatoire", primary language English, bundle ID `com.juliettegudknecht.observatoire`, SKU anything (for example `observatoire1`).

2. Back in Xcode, change the run destination to Any iOS Device, then Product, Archive. When the Organizer window opens, choose Distribute App, App Store Connect, Upload, and accept the defaults. Wait for the email saying the build finished processing (ten to thirty minutes).

3. In App Store Connect, fill in the app page:
   - Screenshots: take them on your phone from the TestFlight build (side button plus volume up), AirDrop them to the Mac, and upload. You need at least one set for a 6.7 inch or 6.9 inch iPhone. The flashcards, the quiz, and a game screen are good choices.
   - Description: something like "A small French practice app built around flashcards grouped by planet, a ten-question quiz, a verb drill, everyday phrases with French audio, and a few dress-up and shop games starring Cosmo the pug. Content sits around A2 with an easier review setting and a harder stretch setting. Progress is saved on your phone." Keywords: french, flashcards, vocabulary, quiz, verbs, A2.
   - Category: Education. Age rating: answer no to everything, which gives 4+.
   - Support URL: https://juliettegudknecht-code.github.io/le-petit-observatoire/ works.
   - Privacy policy URL: https://juliettegudknecht-code.github.io/le-petit-observatoire/privacy.html. That page is in the site now, linked from the footer, and bundled inside the app too.
   - App Privacy: choose Data Not Collected. The app keeps progress on the phone and you have no server, no analytics and no ads. The translate feature sends only the highlighted text to Google Translate or MyMemory to get an answer back, which Apple treats as processing a request, not collecting. The radio uses YouTube's privacy-enhanced embed, and the privacy page discloses all three.
   - App Tracking Transparency: not needed. Nothing tracks anyone across apps.
   - Pricing: Free, all countries or just the US.
   - Build: pick the one you uploaded.

4. Review notes. Apple's guideline 4.2 (minimum functionality) is the one risk here, because they turn down apps that are only a website in a box. Put something like this in the Notes for Review box so the reviewer knows what to look for:

   "This is a personal French-learning app. All content and fonts are bundled inside the app and it works fully offline: flashcard decks grouped by theme with spaced review, a ten-question quiz with scoring, a verb conjugation drill, phrase cards with text-to-speech, and three dress-up and shopping mini games that reinforce vocabulary. Progress and streaks are saved on the device. It uses native haptic feedback on answers, a native daily reminder notification the user can turn on from the home screen, and the system status bar. The only network use is an optional internet radio and an optional highlight-to-translate helper. No account, no ads, no data collection."

   Things that help with 4.2: the app opens instantly with no spinner, works in airplane mode (fonts are bundled, nothing is fetched at launch), has a real icon and launch screen, uses native haptics, notifications and status bar, and does not look like a browser (no address bar, no pinch zoom, no page links that leave the app). All of that is true of this build. If Apple still rejects on 4.2, reply in Resolution Center pointing at the games, the offline quiz and the reminder feature.

5. Submit for review. First reviews usually take one to three days.

## Test it through TestFlight before you submit

TestFlight is Apple's way of installing a store build on real phones before it is public. Same upload, different button. Do this at least once because the store build is signed differently from the one Xcode puts on your phone directly.

1. Upload a build exactly as in the section above (Any iOS Device, Product, Archive, Distribute App, App Store Connect, Upload). Wait for the "has completed processing" email.
2. Install the TestFlight app on your iPhone from the App Store.
3. In App Store Connect, open the app and click the TestFlight tab. The build appears under iOS Builds. If it shows "Missing Compliance", click it and answer No to the encryption question. The project already declares this in Info.plist, so it should not ask, but if it does, that is the answer.
4. Internal testing: in the left column under Internal Testing click the plus, name the group anything, and add yourself as a tester (your Apple ID is already a user). Internal testers get the build at once with no review.
5. Open the email or push notification on your phone, or open TestFlight and sign in, and tap Install. The app installs beside any Xcode copy with the same icon, so delete the Xcode copy first to avoid confusion.
6. Run through everything: open in airplane mode, a quiz, a verb drill, each game, the speaker button, highlight to translate, the radio, close and reopen for progress, and rotate the phone. Note anything odd and tell me.
7. Want someone else to try it, like Josh? Add them under External Testing with their email. External builds go through a short Apple review first, usually a day, and they get a TestFlight invite link.
8. Each new upload needs the build number bumped first, or App Store Connect refuses it. In Xcode, select the App target, General tab, raise Build from 1 to 2 and so on. Version stays 1.0 until you ship a real update.
9. When a TestFlight build is the one you are happy with, go back to the App Store tab, pick that build in the version page, and submit. No new upload needed.

## What is where

- `ios-app/capacitor.config.json`: app name, bundle ID, purple background.
- `ios-app/sync-web.sh`: the copy step. It lists the site files it bundles plus the fonts folder. Add a file there if you add one to the site.
- `native.js` in the site: the only file that knows about the phone. It adds haptics, the status bar style and the daily reminder, and does nothing on the website.
- Native plugins: local notifications, haptics and status bar, all official Capacitor plugins pulled in by `npm run sync` through Swift Package Manager.
- `ios-app/ios/App/App/Assets.xcassets`: the 1024 px icon and the purple launch image, both generated from `icon-512.png`.
- `ios-app/ios/App/App/Info.plist`: display name, orientations, and the no-custom-encryption flag. Nothing else needed since the app has no camera, location, or microphone use.
- `ios-app/ios/App/App/PrivacyInfo.xcprivacy`: Apple's privacy manifest. It says no tracking, no collected data, and declares the one required-reason API Capacitor touches (user defaults, reason CA92.1).
- `privacy.html` in the site: the privacy policy App Store Connect asks for.
- `ios-app/www`, `ios-app/node_modules` and `ios-app/ios/App/App/public` are build output and are not committed.
