const models = require('../models');
const nodemailer = require('nodemailer');

const Contest = models.Competition;
const Entry = models.Entry;
const Account = models.Account;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contest430mvc@gmail.com',
    pass: '3]jhT$tzWrV8&M?Y',
  },
});

const makeContestPage = (req, res) => {
  Contest.ContestModel.findById(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), script:
      '/assets/makerBundle.js', entries: docs });
  });
};

const makeContest = (req, res) => {
  console.log('contest');
  if (!req.body.descrip || !req.body.name || !req.body.reward || !req.body.deadline) {
    return res.status(400).json({ error: 'Meow! Fill out all fields Pwease~' });
  }

  const contestData = {
    name: req.body.name,
    owner: req.session.account._id,
    description: req.body.descrip,
    reward: req.body.reward,
    deadline: req.body.deadline,
  };
  console.log(contestData);
  const newContest = new Contest.ContestModel(contestData);

  const contestPromise = newContest.save();

  contestPromise.then(() => res.json({ redirect: '/home' }));

  contestPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Contest already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return contestPromise;
};


const getContestsByOwner = (request, response) => {
  const req = request;
  const res = response;

  return Contest.ContestModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ contests: docs });
  });
};

const getContestsByDate = (request, response) => {
  const res = response;

  return Contest.ContestModel.findByDeadline(Date.now(), (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ contests: docs });
  });
};

const getContest = (req, res) => {
  if (req.query.owner) {
    getContestsByOwner(req, res);
  } else {
    getContestsByDate(req, res);
  }
  return;
};


const setWin = (request, response) => {
  const res = response;
  const req = request;

  return Entry.EntryModel.findById(req.body.entry, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Entry does not exist' });
    }

    const upgradePromise = Contest.ContestModel.updateOne(
      { _id: req.body.contest }, { winner: docs[0].owner });

    upgradePromise.then(() => Account.AccountModel.findById(docs[0].owner, (err3, winner) => {
      if (err3) {
        console.log(err3);
        return res.status(400).json({ error: 'User does not exist' });
      }

      const mailOptions = {
        from: 'contest430mvc@gmail.com',
        to: winner.email,
        subject: 'Congratulations!',
        html: `Congrats ${winner.username}! You won a contest!`,
      };

      return transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log(`email sent: ${info.response}`);
      });
    }));

    upgradePromise.catch((err2) => {
      console.log(err2);
      if (err2.code === 11000) {
        return res.status(400).json({ error: 'Contest already exists.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });

    return upgradePromise;
  });
};

module.exports.makePage = makeContestPage;
module.exports.make = makeContest;
module.exports.getContestsByOwner = getContestsByOwner;
module.exports.getContestsByDate = getContestsByDate;
module.exports.setWin = setWin;
module.exports.getContests = getContest;
