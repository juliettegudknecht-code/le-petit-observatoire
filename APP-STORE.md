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
   - the speaker button (French audio). It uses the iPhone's built-in French voice. If it is silent, add a French voice under Settings, Accessibility, Spoken Content, Voices.
   - highlight a word to translate. It calls Google and MyMemory over the network, so it needs a connection.
   - close the app fully and reopen it. Your streak and progress should still be there.

## Upload to App Store Connect

1. Go to https://appstoreconnect.apple.com, My Apps, the plus button, New App. Platform iOS, name "Le Petit Observatoire", primary language English, bundle ID `com.juliettegudknecht.observatoire`, SKU anything (for example `observatoire1`).

2. Back in Xcode, change the run destination to Any iOS Device, then Product, Archive. When the Organizer window opens, choose Distribute App, App Store Connect, Upload, and accept the defaults. Wait for the email saying the build finished processing (ten to thirty minutes).

3. In App Store Connect, fill in the app page:
   - Screenshots: take them on your phone (side button plus volume up), AirDrop them to the Mac, and upload. You need at least one set for a 6.7 inch or 6.9 inch iPhone. The flashcards, the quiz, and a game screen are good choices.
   - Description: something like "A small French practice app built around flashcards grouped by planet, a ten-question quiz, a verb drill, everyday phrases with French audio, and a few dress-up and shop games starring Cosmo the pug. Content sits around A2 with an easier review setting and a harder stretch setting. Progress is saved on your phone." Keywords: french, flashcards, vocabulary, quiz, verbs, A2.
   - Category: Education. Age rating: answer no to everything, which gives 4+.
   - Support URL: https://juliettegudknecht-code.github.io/le-petit-observatoire/ works. Privacy policy URL is required. A one-paragraph page saying the app stores progress only on the device and sends nothing to you is enough. I can add that page to the site if you want.
   - App Privacy: choose Data Not Collected. The app keeps progress in local storage on the phone and you have no server. The translate feature does send the highlighted text to Google Translate and MyMemory, but that is not data you collect, and Apple's form is about you.
   - Pricing: Free, all countries or just the US.
   - Build: pick the one you uploaded.

4. Review notes. Apple's guideline 4.2 (minimum functionality) is the one risk here, because they turn down apps that are only a website in a box. Put something like this in the Notes for Review box so the reviewer knows what to look for:

   "This is a personal French-learning app. All content is bundled inside the app and works offline: flashcard decks grouped by theme with spaced review, a ten-question quiz with scoring, a verb conjugation drill, phrase cards with text-to-speech, and three dress-up and shopping mini games that reinforce vocabulary. Progress and streaks are saved on the device. The only network use is an optional internet radio and an optional highlight-to-translate helper. No account, no ads, no data collection."

   Things that help with 4.2: the app opens instantly with no spinner, works in airplane mode, has a real icon and launch screen, and does not look like a browser (no address bar, no page links that leave the app). All of that is already true of this build. If Apple still rejects on 4.2, reply in Resolution Center pointing at the games and offline quiz, and consider adding one phone-only feature such as a daily reminder notification, which I can wire in.

5. Submit for review. First reviews usually take one to three days.

## What is where

- `ios-app/capacitor.config.json`: app name, bundle ID, purple background.
- `ios-app/sync-web.sh`: the copy step. It lists the eight site files it bundles. Add a file there if you add one to the site.
- `ios-app/ios/App/App/Assets.xcassets`: the 1024 px icon and the purple launch image, both generated from `icon-512.png`.
- `ios-app/ios/App/App/Info.plist`: display name and orientations. Nothing else needed since the app has no camera, location, or microphone use.
- `ios-app/www`, `ios-app/node_modules` and `ios-app/ios/App/App/public` are build output and are not committed.
