<?php
$file = 'C:/xampp/htdocs/LA_Bank SPA óvatos/src/txt/quotes.txt';
$quotes = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

$randomIndex = array_rand($quotes);
$randomQuote = $quotes[$randomIndex];

list($quote, $author) = explode(' --', $randomQuote);
?>
  
  <div id="randomQuoteContent">
    <p id="quoteText"><?php echo htmlspecialchars($quote); ?></p>
    <p id="quoteAuthor"><em>-- <?php echo htmlspecialchars($author); ?></em></p>
  </div>
