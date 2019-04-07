const models = require('../models');

const Entry = models.Entry;
const Contest = models.Competition;
const Account = models.Account;

const makeEntryPage = (req, res) => {
  if (req.query.accountInfo) {
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
      return res.render('app', { csrfToken: req.csrfToken(), script:
        'assets/makerBundle.js', account: accountInfo });
    });
  } else {
    Contest.ContestModel.findByDeadline(Date.now(), (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }
      return res.render('app', { csrfToken: req.csrfToken(), script:
        'assets/homeBundle.js', entries: docs });
    });
  }
};

const makeEntry = (req, res) => {
  if (!req.body.content || !req.body.name) {
    return res.status(400).json({ error: 'Meow! Fill out entry Pwease~' });
  }

  const entryData = {
    content: req.body.content,
    contest: req.body.contest,
    name: req.body.name,
    owner: req.session.account._id,
  };
  return Contest.ContestModel.findById(req.body.contest, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    console.log(docs);
    if (docs.length < 1) return res.status(400).json({ error: 'Contest does not exist' });

    const newEntry = new Entry.EntryModel(entryData);

    const entryPromise = newEntry.save();

    entryPromise.then(() => {
      const upgradePromise = Contest.ContestModel.updateOne(
        { _id: req.body.contest }, { entries: docs[0].entries + 1 });

      upgradePromise.then(() => res.json({ redirect: '/home' }));
      upgradePromise.catch((err2) => {
        console.log(err2);
        return res.status(400).json({ error: 'An error occurred' });
      });
    });

    entryPromise.catch((err2) => {
      console.log(err2);
      if (err2.code === 11000) {
        return res.status(400).json({ error: 'Entry already exists.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });

    return entryPromise;
  });
};

const getEntriesByOwner = (request, response) => {
  const req = request;
  const res = response;

  return Entry.EntryModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ entries: docs });
  });
};

const getEntriesByContest = (request, response) => {
  const req = request;
  const res = response;
  return Entry.EntryModel.findByContest(req.query.contest, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ entries: docs });
  });
};


module.exports.makePage = makeEntryPage;
module.exports.make = makeEntry;
module.exports.getEntriesByOwner = getEntriesByOwner;
module.exports.getEntriesByContest = getEntriesByContest;
