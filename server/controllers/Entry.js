const models = require('../models');

const Entry = models.Entry;
const Contest = models.Competition;

const makeEntryPage = (req, res) => {
  Contest.ContestModel.findByDeadline(Date.now(), (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), entries: docs });
  });
};

const makeEntry = (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({ error: 'Meow! Fill out entry Pwease~' });
  }

  const entryData = {
    content: req.body.content,
    contest: req.body.contest,
    owner: req.session.account._id,
  };

  const newEntry = new Entry.EntryModel(entryData);

  const entryPromise = newEntry.save();

  entryPromise.then(() => res.json({ redirect: '/home' }));

  entryPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Entry already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return entryPromise;
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

  return Entry.EntryModel.findByContest(req.body.contest, (err, docs) => {
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
