RSS = require "rss"

### lets create an rss feed ###

feed = new RSS(
  title: "title"
  description: "description"
  feed_url: "http://example.com/rss.xml"
  site_url: "http://example.com"
  image_url: "http://example.com/icon.png"
  docs: "http://example.com/rss/docs.html"
  managingEditor: "Dylan Greene"
  webMaster: "Dylan Greene"
  copyright: "2013 Dylan Greene"
  language: "en"
  categories: [
    "Category 1"
    "Category 2"
    "Category 3"
  ]
  pubDate: "May 20, 2012 04:00:00 GMT"
  ttl: "60"
  custom_namespaces: "itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd"
  custom_elements: [
    { "itunes:subtitle": "A show about everything" }
    { "itunes:author": "John Doe" }
    { "itunes:summary": "All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our podcast in the Podcasts app or in the iTunes Store" }
    { "itunes:owner": [
      { "itunes:name": "John Doe" }
      { "itunes:email": "john.doe@example.com" }
    ] }
    { "itunes:image": _attr: href: "http://example.com/podcasts/everything/AllAboutEverything.jpg" }
    { "itunes:category": [
      { _attr: text: "Technology" }
      { "itunes:category": _attr: text: "Gadgets" }
    ] }
  ])

### loop over data and add to feed ###

feed.item
  title: "item title"
  description: "use this for the content. It can include html."
  url: "http://example.com/article4?this&that"
  guid: "1123"
  categories: [
    "Category 1"
    "Category 2"
    "Category 3"
    "Category 4"
  ]
  author: "Guest Author"
  date: "May 27, 2012"
  lat: 33.417974
  long: -111.933231
  # enclosure:
  #   url: "..."
  #   file: "path-to-file"
  custom_elements: [
    { "itunes:author": "John Doe" }
    { "itunes:subtitle": "A short primer on table spices" }
    { "itunes:image": _attr: href: "http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg" }
    { "itunes:duration": "7:04" }
  ]
# cache the xml to send to clients

# Controller for the privacy page. Simply displays the privacy policy view.
controller = module.exports =
  get: (request, response, next) ->
    xml = feed.xml()
    response.end xml

  routes: (router, localizedUrl) -> router.get (localizedUrl "/rss"), @get