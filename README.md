# Le Petit Observatoire

A small French practice site for Juliette and Cosmo the pug. Flashcards by planet, a ten-question quiz, a verb drill, real-life phrases, French audio, and a radio in the corner with Indila on station one.

Content sits around A2 (about Duolingo level 27) with an A1 review setting and a B1 stretch setting. Progress is stored in the browser only.

Plain HTML, CSS and JavaScript. No build step. Open index.html or serve the folder.

## iPhone app

The `ios-app/` folder wraps this same site in a native iOS shell with Capacitor so it can go on the App Store. It copies the files above into the app at build time and never changes them. See `APP-STORE.md` for the steps.
Fonts are bundled in `fonts/` so the site and the app both work offline. `native.js` only does anything inside the iPhone app.
