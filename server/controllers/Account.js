const models = require('../models');
const nodemailer = require('nodemailer');

const Account = models.Account;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contest430mvc@gmail.com',
    pass: '3]jhT$tzWrV8&M?Y',
  },
});

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const accountPage = (req, res) => {
  Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
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

const upgrade = (req, res) => {
  Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const accountInfo = {
      username: docs.username,
      email: docs.email,
      type: docs.type,
    };


    const upgradePromise = Account.AccountModel.updateOne(
      { username: accountInfo.username }, { type: 'Premium' });

    upgradePromise.then(() => {
      const mailOptions = {
        from: 'contest430mvc@gmail.com',
        to: accountInfo.email,
        subject: 'Account Creation Confirmation',
        html: `Thank you ${accountInfo.username}. You updated your account with Contest.
         You can now create contests.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log(`email sent: ${info.response}`);
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
};


const emailChange = (req, res) => {
  if (!req.body.email) return res.status(400).json({ error: 'Please put a new email!' });
  return Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    const accountInfo = {
      username: docs.username,
      email: docs.email,
      type: docs.type,
    };


    const upgradePromise = Account.AccountModel.updateOne(
      { username: accountInfo.username }, { email: req.body.email });

    upgradePromise.then(() => {
      const mailOptions = {
        from: 'contest430mvc@gmail.com',
        to: req.body.email,
        subject: 'Account Information Change Confirmation',
        html: `Hello ${accountInfo.username}. You updated your account with Contest.
         Your new email is ${req.body.email}.`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) console.log(error);
      });
      mailOptions.to = accountInfo.email;
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
};


const passChange = (req, res) => {
  if (!req.body.pass) return res.status(400).json({ error: 'Please put a new password!' });
  return Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const accountInfo = {
      pass: docs.password,
      email: docs.email,
      type: docs.type,
    };

    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      const upgradePromise = Account.AccountModel.updateOne(

      { username: req.session.account.username }, { password: hash, salt });

      upgradePromise.then(() => {
        const mailOptions = {
          from: 'contest430mvc@gmail.com',
          to: accountInfo.email,
          subject: 'Account Information Change Confirmation',
          html: `Hello ${accountInfo.username}. You updated your account with Contest.
         Your new password is ${req.body.pass}.`,
        };

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

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

    // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/home' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  req.body.email = `${req.body.email}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2 || !req.body.email) {
    return res.status(400).json({ error: 'Meow! All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Meow! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      email: req.body.email,
      type: 'Basic',
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);

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
