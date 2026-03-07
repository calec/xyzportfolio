require(`dotenv`).config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    // Used for the title template on pages other than the index site
    siteTitle: `Cale Corwin's Portfolio`,
    // Default title of the page
    siteTitleAlt: `Cale's Portfolio`,
    // Can be used for e.g. JSONLD
    siteHeadline: `Cale's Portfolio`,
    // Will be used to generate absolute URLs for og:image etc.
    siteUrl: `https://cale.xyz`,
    // Used for SEO
    siteDescription: `Cale Corwin's development portfolio`,
    // Will be set on the <html /> tag
    siteLanguage: `en`,
    // Used for og:image and must be placed inside the `static` folder
    siteImage: `/banner.jpg`
  },
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-cara`,
      options: {},
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_ID,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `CALE_OS — Cale Corwin's Portfolio`,
        short_name: `CALE_OS`,
        description: `Retro terminal OS portfolio by Cale Corwin`,
        start_url: `/`,
        background_color: `#0a0a0a`,
        theme_color: `#33ff33`,
        display: `standalone`,
        icons: [
          {
            src: `/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-netlify`,
  ],
}
