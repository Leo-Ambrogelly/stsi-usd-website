# STS-I at USD Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/10f8c371-39a2-42b1-bf61-4014addd7e88/deploy-status)](https://app.netlify.com/projects/stsiatusd/deploys)

The Science, Technology, & Society Initiative (STS-I) at USD aims to establish a Science and Technology Studies program. The site documents activities and information about STS-I and explores science and technology in its social, cultural, and historical contexts.

## Running Locally

1. Install dependencies with `npm install` or `yarn install`.
2. Start the site with `hugo server` or `npm run dev`.

## Embedding PDFs in Posts

Use the `pdf` shortcode to display PDF files within blog posts.

```
{{</* pdf src="/path/to/file.pdf" title="Descriptive title" height="600px" */>}}
```

`src` is the path to the PDF (relative to the site root), `title` is optional, and `height` sets the viewer height.
