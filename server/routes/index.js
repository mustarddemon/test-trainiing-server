var express = require('express');
var Promise = require('bluebird');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: false });

var stateMap = {
  CO: 'colorado',
  CA: 'california',
  NY: 'New York',
  ID: 'Idaho',
  PA: 'Pennsylvania',
  UT: 'Utah',
  AZ: 'Arizona',
  FL: 'Florida',
  GA: 'Georgia',
  IL: 'Illinois'
};


/* GET home page. */
router.get('/', function(req, res) {

  //Data passed in can be used in jade template engine
  return res.render('index.pug');
});

router.get('/basics', function(req, res) {
  var name = req.query.username;
  var state = req.query.state;
  var start = req.query.start;
  var bug = [];

  if (!start) {
    if (!name) {
      bug.push('No name specified should return an error and it doesnt');
    } else if (!isNaN(name)) {
      bug.push('It shouldnt allow a number for a name');
    } else if ( name.length > 100) {
      name = 'UNEXPECTED ERROR';
      bug.push('Using a name over 100 characters long causes it to break!');
    } else if (name.includes('%') || name.includes('~') || name.includes('(')) {
      name = 'UNEXPECTED ERROR';
      bug.push('Some special characters in thename field cause it to break!');
    }


    //HANDLE STATE BUGS
    if (!state) {
      bug.push('No state specified should return an error and it doesnt');
    } else if (!isNaN(state)) {
      bug.push('It Shouldnt allow a number for a state!');
    } else if (state.length !== 2) {
      bug.push('Invalid state code given should be 2 characters');
    } else if (!stateMap[state] && stateMap[state.toUpperCase()]) {
      bug.push('Inputting states not in upper case fails');
    } else if (!stateMap[state.toUpperCase()]) {
      bug.push('State entered is not supported!');
    }

  }

  return res.render('basics.pug', {
    name: name,
    state: stateMap[state],
    bug: bug.length > 0 ? bug : null
  });
});


router.get('/equivalencePartitioning', function(req, res) {
  var start = req.query.start;
  var age = req.query.age;
  var seconds = -1;
  var bug = [];
  if (!start) {
    if (!age) {
      bug.push('Age must be entered');
    } else if (age.includes(',')) {
      bug.push('Age cannot handle comma separated numbers');
    } else if (isNaN(age)) {
      bug.push('Age must be a number!');
      seconds = -2;
    } else if (age.includes('.')) {
      seconds = 'UNEXPECTED ERROR';
      bug.push('Age cannot be a decimal number');
    } else if (age === 0) {
      seconds = 'UNEXPECTED ERROR';
      bug.push('Age cannot be 0');
    } else if (age < 0) {
      seconds = 'UNEXPECTED ERROR';
      bug.push('Age cannot be a negative number');
    } else if (age > 1000) {
      seconds = 'UNEXPECTED ERROR';
      bug.push('Age greater than 1000 causes error');
    } else if (age < 5) {
      seconds = 'UNEXPECTED ERROR';
      bug.push('five year old and under cannot use this website!');
    } else if (age > 100) {
      seconds = 'UNEXPECTED ERROR';
      bug.push('One hundred year olds cannot use this site');
    } else {
      seconds = 60 * 60 * 24 * 365 * age;
    }

  }

  return res.render('partition.pug', {
    age: age,
    seconds: seconds,
    bug: bug.length > 0 ? bug : null
  });
});

router.get('/securitytesting', function(req, res) {
  var start = req.query.start;
  var name = req.query.name;
  var bug = [];
  var queryResult = [
    {
      pet: 'dog'
    },
    {
      pet: 'cat'
    }
  ];

  if (!start) {
    if (!name) {
      bug.push('Name must be entered');
    } else if (name.includes('\'') && name.toLowerCase().includes('select')) {
      queryResult = [
        {
          pet: 'MyUserName'
        },
        {
          pet: 'MySecretBankAccount'
        }
      ];
      bug.push('SQL Injection to allow querying things you are not supposed to');
    } else if (name.includes('\'') && (name.toLowerCase().includes('delete') || name.toLowerCase().includes('drop'))) {
      queryResult = [
        {
          pet: 'DELETED'
        },
        {
          pet: 'DELETED'
        }
      ];
      bug.push('SQL Injection to delete from or drop tables');

    } else if (name.includes('\'') && name.includes('alert') && name.includes('onhover')) {
      name = 'ROLLOVER';
      bug.push('Cross site scripting allows us to insert our own javascript to be triggered by unsuspecting users');
    } else if (name.includes('\'') && name.includes('alert')) {
      name = 'JAVASCRIPT';
      bug.push('Cross site scripting allows us to insert our own javascript');
    } else if (name.includes('\'') && name.includes('<')) {
      name = 'HTML';
      bug.push('Cross site scripting allows us to insert our own html');
    }
  }

  return res.render('security.pug', {
    queryResult: queryResult,
    name: name,
    bug: bug.length > 0 ? bug : null
  });
});

router.get('/localization', function(req, res) {
  var start = req.query.start;
  var language = req.query.language;
  var date = req.query.date;
  var amount = req.query.amount;
  var langData = {
    USA: {
      amountText: 'Enter amount'
    },
    UK: {
      amountText: 'Please enter the amount of money'
    },
    German: {
      amountText: 'Geben Sie die Geldmenge ein, die Sie in Ihr Konto einzahlen möchten'
    }
  };
  var bug = [];
  var done = false;
  if (!start) {
    if (!amount) {
      bug.push('Amount must be provided');
      done = true;
    }
    if (!date) {
      bug.push('Date must be provided');
      done = true;
    }

    if (!done) {
      var dateSplit = date.split('-');
      if (dateSplit.length !== 3) {
        bug.push('Date must be in mm-dd-yyyy or dd-mm-yyyy format');
        done = true;
      }
      var day, month, year;
      if (!done && language !== 'USA') {
        day = dateSplit[0];
        month = dateSplit[1];
        year = dateSplit[2];
        if (amount.includes('.')) {
          bug.push('NON US LOCALES USE , Instead of Decimal Point');
        }
      } else {
        day = dateSplit[1];
        month = dateSplit[0];
        year = dateSplit[2];
        if (amount.includes(',')) {
          bug.push('US LOCALES USE . Instead of , ');
        }
      }
      if (month > 12) {
        bug.push('Month is greater than 12!');
      }
      if (day > 31) {
        bug.push('Date is too big for month');
      }
      if (month === 2 && day > 28) {
        bug.push('Date is too big for month');
      }
      if (year < 2017) {
        bug.push('Cannot deposit money in the past');
      }
      if (year > 2018) {
        bug.push('Cannot deposit more than 1 year in the future');
      }

    }

  }
  var amountText = '';
  if (langData[language]) {
    amountText = langData[language].amountText;
  }
  return res.render('localization.pug', {
    bug: bug.length > 0 ? bug : null,
    amountText: amountText
  });
});



module.exports = router;
