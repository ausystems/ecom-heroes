# Ecom Heroes — Website

Marketing site for Ecom Heroes (remote talent system for e-commerce). Two static
pages — **Home** (`index.html`) and **Contact** (`contact.html`) — built as plain
HTML/CSS/JS with GSAP + Lenis for motion. No build step required.

## Project structure

```
.
├── index.html            # Homepage (~74 KB)
├── contact.html          # Contact page (~86 KB)
├── assets/
│   ├── css/
│   │   └── site.css      # Shared stylesheet (design system + sections)
│   ├── js/
│   │   ├── libs.js       # Vendor bundle (GSAP + Lenis), shared by both pages
│   │   └── home.js       # Homepage behaviours / animations
│   └── img/              # WebP images (content-hashed + logo + sky background)
├── vercel.json           # Static hosting config + cache headers
├── robots.txt
├── sitemap.xml
└── .gitignore
```

Contact-page-specific styles and scripts remain inline in `contact.html` and load
*after* `site.css`, so they override the shared design system where needed.

## Performance

- All CSS, JS and images are external and cacheable across page loads (the giant
  911 KB single-file homepage was split down to ~74 KB of HTML).
- Images are WebP; below-the-fold ones use `loading="lazy"`, all use
  `decoding="async"`.
- Long-lived immutable caching for `/assets/img/**`; HTML always revalidates.
- Both HTML documents are under 90 KB.

## Run locally

Any static file server works. For example:

```bash
python3 -m http.server 4173
# then open http://localhost:4173/index.html
```

or with Node:

```bash
npx serve .
```

## Deploy

### Vercel
1. Push this folder to a GitHub repository.
2. In Vercel, **Add New → Project** and import the repo.
3. Framework preset: **Other** (no build command, output directory `.`).
4. Deploy. `vercel.json` handles caching and security headers automatically.

You can also deploy from the CLI:

```bash
npm i -g vercel
vercel        # preview
vercel --prod # production
```

### GitHub Pages (alternative)
Enable Pages on the `main` branch, root folder. The relative asset paths work as-is.

## Notes
- Update the domain in `robots.txt` and `sitemap.xml` if you deploy under a
  different hostname.
- Replace `assets/img/logo.webp` to change the brand logo (used in the nav and as
  the favicon on both pages).
