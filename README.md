# Glow & Grace Salon

A luxury black-and-gold salon website built with **HTML5, CSS3 and vanilla JavaScript**. No frameworks, no build step, ready for static hosting.

> **Demo project:** Glow & Grace Salon is a fictional business. Prices, reviews and contact details are sample content.

## Features

- Responsive layout (mobile, tablet, laptop, desktop)
- Sticky navbar with mobile menu and smooth scrolling
- Services, gallery with lightbox (Esc and arrow-key support), sample reviews
- Appointment enquiry form with validation (frontend demo only)
- Floating WhatsApp button, back-to-top button, dynamic copyright year
- Accessibility: semantic HTML, visible focus, alt text, reduced-motion support

## Folder Structure

```
glow-grace-salon/
├── index.html          # Page structure and content
├── css/
│   └── style.css       # All styling (colours and fonts at the top)
├── js/
│   └── script.js       # Menu, lightbox, form validation, animations
├── assets/
│   └── images/
│       └── README.md   # Image names and guidelines
└── README.md           # This file
```

## Run Locally

1. Install **VS Code** and the **Live Server** extension.
2. Open the `glow-grace-salon` folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**.

(You can also double-click `index.html` to open it in a browser.)

## How to Edit

| What | Where |
|---|---|
| Text, headings | `index.html` |
| Prices | `index.html`, Services section (`.price`) |
| Contact details | `index.html`, Contact section **and** Footer |
| Colours and fonts | `css/style.css`, `:root { ... }` at the top |
| Images | `assets/images/` (see its README for file names) |
| Social links | `index.html`, Footer (replace `href="#"`) |

Search for `EDIT:` comments in `index.html` to find the main places to update.

## WhatsApp Number

In `index.html`, find the link with `id="whatsappBtn"` and replace `910000000000` in the `wa.me` URL with the salon owner's **authorised** number: country code + number, no `+` or spaces.

Example: `919876543210`

Until you change it, the button shows a demo message instead of opening a chat.

## About the Enquiry Form

The form is a **frontend demo**. It validates input, but it does **not** send or save anything, and no appointment is booked.

To receive real enquiries, connect a form service such as **Netlify Forms** or **Formspree**, or build a backend.

## Upload to GitHub

1. Create a new empty repository on [github.com](https://github.com).
2. In the VS Code terminal, inside the project folder:

```bash
git init
git add .
git commit -m "Initial commit: Glow & Grace Salon website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/glow-grace-salon.git
git push -u origin main
```

## Deploy on Netlify

**Option A: Drag and drop**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the whole `glow-grace-salon` folder onto the page.

**Option B: From GitHub**
1. In Netlify, choose **Add new site → Import an existing project** and select your repository.
2. Leave **Build command** empty. Set **Publish directory** to `.` (the root).
3. Click **Deploy**.

## Before Showing to a Real Client

- [ ] Replace sample images with the salon's own or properly licensed photos
- [ ] Confirm and update all prices
- [ ] Replace address, phone, email, hours (Contact **and** Footer)
- [ ] Replace the sample reviews with real, permitted customer reviews, or remove them
- [ ] Add the authorised WhatsApp number
- [ ] Add real social media links
- [ ] Add a Google Maps embed in place of the map placeholder
- [ ] Connect a real form service
- [ ] Remove "demo" and "sample" labels once the content is real
- [ ] Update page title and meta description in `index.html`

## Credits

Fonts: Cormorant Garamond and Jost (Google Fonts). Demo photos: Unsplash. Check each image's licence before commercial use.