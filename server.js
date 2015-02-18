/*
Node version of the server used in task 6 - Android Programming at
Høgskolen i Sør-Trøndelag. Shares the same functionality as the task
requirements.
*/

var express = require('express');
var session = require('express-session');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(session({
  secret: 'hemmelig kode hemmelig',
  name: 'GuessNumber',
  resave: false,
  saveUninitialized: false
}));

var sess;

app.get('/', function(req, res) {
  sess=req.session;

  if (req.query.name) {
    if (typeof req.query.cardnumber == "undefined") {
      res.send("Please provide us your credit card number.");
      return;
    }

    sess.name = req.query.name;
    sess.cardnumber = req.query.cardnumber;
    sess.counter = 0;
    sess.correctNumber = Math.floor(Math.random() * 10) + 1;
    console.log("Player " + sess.name + " connected");
    res.send("Guess a number between 1 and 10.");
    return;
  }

  if (typeof sess.correctNumber == "undefined") {
    res.send("Please register with username and credit card number.");
    return;
  }

  correct = sess.correctNumber;
  counter = sess.counter;
  str = "Something went wrong. Yikes!";
  if (counter > 2) {
    res.send("You have no more tries left!");
    return
  } else {
    guess = parseInt(req.query.number);
    if (isNaN(guess)) {
      res.send("Invalid number. Please try again.");
      return
    }
    counter++;
    sess.counter = counter;

    if (guess === correct) {
      console.log(sess.name + " won!");
      res.send(sess.name + ", you have won $1 million in credit on card number "
      + sess.cardnumber);
      return;
    } else if (guess < correct) {
      str = "The number " + guess + " is too low! ";
      if (counter === 3) str += "Ya blew it! No more tries buddy.";
    } else if (guess > correct) {
      str = "The number " + guess + " is too high! ";
      if (counter === 3) str += "Ya blew it! No more tries buddy.";
    }
  }
  res.send(str);
});

app.listen(app.get('port'), function() {
  console.log("Server listening on port " +app.get('port'));
});
