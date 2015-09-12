Footer = ($scope, $log, $timeout) ->
  logger = $log.init Footer.tag
  logger.log "initializing"

  quotes = [
    "Dont measure anything unless the data help you make better decisions - Seth Godin"
    "Every problem has a solution. You just have to be creative enough to find it - Travis Kalanick"
    "Fear is the disease. Hustle is the antidote. - Travis Kalanick"
    "I want to do one thing, and do it well - Jan Koum"
    "In my 20s I was thrashing around in the water, trying to keep my head above it. In my 30s, I realized it was only three feet deep and I stood up - Leslie Bradshaw"
    "Optimism, pessimism, f**k that; we’re going to make it happen. As God is my bloody witness, I’m hell-bent on making it work. - Elon Musk"
    "Our industry does not respect tradition – it only respects innovation - Satya Nadella"
    "Some people don’t like change, but you need to embrace change if the alternative is disaster - Elon Musk"
    "Startups don’t win by attacking. They win by transcending. There are exceptions of course, but usually the way to win is to race ahead, not to stop & fight - Paul Graham"
    "The most impressive people I know spent their time with their head down getting shit done for a long, long time - Sam Altman"
    "Think of yourself as an insensitive, nitpicking, irritable fool to use the product - Pony Ma"
    "Whenever you find yourself on the side of the majority, it is time to pause and reflect - Mark Twain"
    "\"Make something people want\" includes making a company that people want to work for - Sahil Lavingia"
  # Randomly sort this array
  ].sort (a,b) -> parseInt( Math.random()*10 ) % 2

  # Grab a random quote from the list below
  startIndex = Math.floor Math.random() * quotes.length
  randomQuote = -> quotes[++startIndex % quotes.length]

  change = ->
    $scope.quote = randomQuote()

    # After 10 seconds change the quote
    $timeout(10 * 1000).then -> change()
  change()



Footer.tag = "component:footer"
Footer.$inject = [
  "$scope"
  "$log"
  "$timeout"
]
module.exports = Footer