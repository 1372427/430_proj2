const models = require('../models');
const nodemailer = require('nodemailer');

const Account = models.Account;

// set up information to send emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contest430mvc@gmail.com',
    pass: '3]jhT$tzWrV8&M?Y',
  },
});

// render the login page template
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// query DB for account information
const accountPage = (req, res) => {
  Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    // only send back relevant information
    const accountInfo = {
      username: docs.username,
      email: docs.email,
      type: docs.type,
      mascot: docs.mascot,
      id: docs._id,
    };
    return res.json({ account: accountInfo });
  });
};

// handles change from basic to premium account and sends an email
const upgrade = (req, res) => {
  // find the current signed in user
  Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    // get account information
    const accountInfo = {
      username: docs.username,
      email: docs.email,
      type: docs.type,
    };

    // upgrade account
    const upgradePromise = Account.AccountModel.updateOne(
      { username: accountInfo.username }, { type: 'Premium' });

    // if successful, send an email
    upgradePromise.then(() => {
      // set up email
      const mailOptions = {
        from: 'contest430mvc@gmail.com',
        to: accountInfo.email,
        subject: 'Account Creation Confirmation',
        html: `Thank you ${accountInfo.username}. You updated your account with Contest.
         You can now create contests.`,
      };

      // send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log(`email sent: ${info.response}`);
      });

      // refresh page
      res.json({ redirect: '/accountInfo' });
    });

    upgradePromise.catch((err2) => {
      console.log(err2);
      if (err2.code === 11000) {
        return res.status(400).json({ error: 'Account already exists.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });

    return upgradePromise;
  });
};

// handle account email change
const emailChange = (req, res) => {
  // check if there is an email to change to
  if (!req.body.email) return res.status(400).json({ error: 'Please put a new email!' });
  // find this account
  return Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    // get relevant account information
    const accountInfo = {
      username: docs.username,
      email: docs.email,
      type: docs.type,
    };

    // update account
    const upgradePromise = Account.AccountModel.updateOne(
      { username: accountInfo.username }, { email: req.body.email });

    // if update is successful, send an email
    upgradePromise.then(() => {
      // set up email to new email address
      const mailOptions = {
        from: 'contest430mvc@gmail.com',
        to: req.body.email,
        subject: 'Account Information Change Confirmation',
        html: `Hello ${accountInfo.username}. You updated your account with Contest.
         Your new email is ${req.body.email}.`,
      };

      // send email
      transporter.sendMail(mailOptions, (error) => {
        if (error) console.log(error);
      });
      // set up email for old address and send
      mailOptions.to = accountInfo.email;
      transporter.sendMail(mailOptions, (error) => {
        if (error) console.log(error);
      });
      // refresh account page
      res.json({ redirect: '/accountInfo' });
    });

    upgradePromise.catch((err2) => {
      console.log(err2);
      if (err2.code === 11000) {
        return res.status(400).json({ error: 'Account already exists.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });

    return upgradePromise;
  });
};

// handle password change
const passChange = (req, res) => {
  // check if there is a new password
  if (!req.body.pass) return res.status(400).json({ error: 'Please put a new password!' });
  // find account
  return Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    // get relevant account information
    const accountInfo = {
      pass: docs.password,
      email: docs.email,
      type: docs.type,
    };

    // rehash the password and update
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      const upgradePromise = Account.AccountModel.updateOne(
      { username: req.session.account.username }, { password: hash, salt });

      // if update is successful, send email
      upgradePromise.then(() => {
        // set up email
        const mailOptions = {
          from: 'contest430mvc@gmail.com',
          to: accountInfo.email,
          subject: 'Account Information Change Confirmation',
          html: `Hello ${accountInfo.username}. You updated your account with Contest.
         Your new password is ${req.body.pass}.`,
        };

        // send email
        transporter.sendMail(mailOptions, (error) => {
          if (error) console.log(error);
        });

        res.json({ redirect: '/accountInfo' });
      });

      upgradePromise.catch((err2) => {
        console.log(err2);
        if (err2.code === 11000) {
          return res.status(400).json({ error: 'Account already exists.' });
        }

        return res.status(400).json({ error: 'An error occurred' });
      });

      return upgradePromise;
    });
  });
};

// handle user logout
const logout = (req, res) => {
  // get rid of this session information
  req.session.destroy();
  // send to home page
  res.redirect('/');
};

// handle user login
const login = (request, response) => {
  const req = request;
  const res = response;

    // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // check all fields exist
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // check if passowrd is correct
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    // set up session if accout is correct
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/home' });
  });
};

// handle signup
const signup = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  req.body.email = `${req.body.email}`;

  // check all fields exist
  if (!req.body.username || !req.body.pass || !req.body.pass2 || !req.body.email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // check passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // make hash with the password
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      email: req.body.email,
      type: 'Basic',
    };

    // create new account
    const newAccount = new Account.AccountModel(accountData);

    // save account
    const savePromise = newAccount.save();

    // if save is successful
    savePromise.then(() => {
      // update session
      req.session.account = Account.AccountModel.toAPI(newAccount);

      // send confirmation email
      const mailOptions = {
        from: 'contest430mvc@gmail.com',
        to: accountData.email,
        subject: 'Account Creation Confirmation',
        html: `Thank you ${accountData.username}. You created an account with Contest.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log(`email sent: ${info.response}`);
      });

      return res.json({ redirect: '/home' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.upgrade = upgrade;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.accountPage = accountPage;
module.exports.passChange = passChange;
module.exports.emailChange = emailChange;
