# Wedding Invitation Website

A single-page temple-door invitation (HTML, CSS and vanilla JS, with no build step). The flow follows the reference
(kuberan-weds-cantiriga.netlify.app), but the artwork is your own four frames, and it adds wine/gold gradients,
gold-foil text, frosted glass cards and falling petals.

## Flow
1. **Opening gate** (`door.jpg`): the two door leaves are cut from your artwork and swing open in 3D. The camera then zooms through the doorway.
2. **Hero** (`temple.jpg`): the quote, the couple's names in gold foil, and the date pill.
3. **Our Families**: written inside your gopuram frame (`frame.jpg`).
4. **The Wedding** (`mandapam.jpg`): event cards, a live countdown and the venue card with directions.
5. **RSVP**: a wine and gold section. Guests fill in a bottom sheet (name, guests, note), which sends the reply on WhatsApp.
6. **A message for you**: tapping the wax seal opens a letter.
7. **Guest Guide**: the "Travel to" banner, a map, driving distances and WhatsApp help.
8. **Gallery**: a polaroid stack you can swipe, with a lightbox.
9. **Thank You**: shown inside the gopuram frame again, followed by the footer.

## Folder structure
```
index.html  style.css  script.js
assets/images/
  door.jpg       opening temple door (your frame 1, with the heart overlay removed)
  temple.jpg     hero + message + travel banner (your frame 3)
  mandapam.jpg   The Wedding background (your frame 2)
  frame.jpg      gopuram border for Families + Thank You (your frame 4)
  gallery1.jpg … gallery6.jpg   your photos, portrait 4:5 (a gold "A & M" card shows until you add them)
  thumbnail.jpg  1200×1200 WhatsApp preview    favicon.png
assets/music/music.mp3   background song
```

## What to edit
1. **index.html**: names, parents, event times, venue, distances, captions, hashtag, and the "A & M" monogram in style.css (`.stack .photo:has(img.no-img)::after`).
2. **index.html `<head>`**: the Open Graph tags. `og:image` must be the full `https://` URL of the deployed `thumbnail.jpg`.
3. **Map**: in Google Maps, go to Share, then *Embed a map*, and paste the `src` into the `<iframe>`.
4. **script.js `CONFIG`**: the wedding date and time, the WhatsApp number (digits only, with country code), the Maps link and the couple's names.

## Deploy
Drag the folder onto app.netlify.com/drop, or push it to GitHub Pages.
