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
- **Projects** - links to things I've built, growing as I build them
- **Contact** - copy my email or send a message straight from the page
- **Resume view** - a print-friendly one-page CV version of everything above

## How it's built

Plain HTML, CSS and JavaScript. No framework, no build step.

```
public/
  index.html    page structure and content
  styles.css    all styling, including print and reduced-motion rules
  script.js     tab switching, resume view, copy-to-clipboard, contact form
  _headers      security headers (CSP, HSTS, X-Frame-Options and others)
  assets/       profile photo and icons
```

The contact form sends through Web3Forms with a honeypot field and a client-side
rate limit, so there's no backend to run.
