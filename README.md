# CV Website

My personal CV site, live at [danielspiers.com](https://danielspiers.com).

I'm Daniel Spiers, a Year 12 student at Birkenhead Sixth Form College studying
Statistics, Computer Science and Economics. This site is where I keep my CV,
grades, skills and projects in one place so anyone can see them.

## What's on the site

- **About me** - who I am, what I study, technical skills and strengths
- **Education** - current college, A Levels, and the route to a Computer Science degree
- **GCSEs** - full results table with a grade distribution chart
- **Predicted grades** - filled in once the college issues them
- **Experience** - volunteering and interests (rugby, hiking, programming)
- **Projects** - cards for each finished project with its tech and a link to the code
- **Contact** - copy my email or send a message straight from the page
- **Resume view** - a print-friendly CV version of everything above, with a PDF download

## How it's built

Plain HTML, CSS and JavaScript. No framework, no build step.

```
public/
  index.html    page structure and content
  styles.css    all styling, including print and reduced-motion rules
  script.js     tab switching, resume view, copy-to-clipboard, contact form
  _headers      security headers (CSP, HSTS, X-Frame-Options and others)
  assets/       profile photo and icons
  Daniel-Spiers-CV.pdf
```

The PDF is rendered straight from the resume view with headless Chrome, so it always matches the page.

The contact form sends through Web3Forms with a honeypot field and a client-side
rate limit, so there's no backend to run.

## Security

[![Security Headers: A+](https://img.shields.io/badge/Security%20Headers-A%2B-brightgreen)](https://securityheaders.com/?q=danielspiers.com&followRedirects=on)

The site scores **A+** on [securityheaders.com](https://securityheaders.com/?q=danielspiers.com&followRedirects=on).
Every response carries:

| Header | Value |
|---|---|
| Content-Security-Policy | `default-src 'none'` with only the site's own scripts, Google Fonts and the form endpoint allowed |
| Strict-Transport-Security | 1 year, subdomains included, preload |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera, microphone, geolocation, payment and USB all off |
| Cross-Origin-Opener-Policy | `same-origin` |
| Cross-Origin-Resource-Policy | `same-origin` |

HTTP redirects to HTTPS, `www` redirects to the root domain, and no inline JavaScript is used so the CSP can stay strict.
