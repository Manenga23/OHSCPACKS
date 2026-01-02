# OHSC Medical Practice Compliance Pack Builder (SA)

Static, client-side website that generates an inspection-ready compliance pack (SOPs + registers + evidence map) in **English or Afrikaans**.

## Features
- Language selector (EN/AF)
- Practice setup form (placeholders auto-filled)
- Demo vs Full access toggle (temporary; replace with PayFast/EFT later)
- ZIP download (client-side using JSZip)
- Cold chain content included only if vaccines stored

## Run locally
Use any static server. Example with Python:

```bash
cd public
python -m http.server 8000
```

Then open: http://localhost:8000

## Deploy
### Option 1 (recommended): GitHub + Netlify
1. Push this repo to GitHub
2. In Netlify: **New site from Git**
3. Build command: *(none)*
4. Publish directory: `public`

### Option 2: Netlify only
Drag-and-drop the `public/` folder contents into Netlify (manual deploy). You lose version control, so GitHub is recommended.

## PayFast/EFT (later)
Replace the temporary `FULL_ACCESS` checkbox with a paid/unlocked flag and call the same `downloadZip()` function.
