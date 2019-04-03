const models = require('../models');

const Contest = models.Competition;

const makeContestPage = (req, res) => {
  Contest.ContestModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), entries: docs });
  });
};

const makeContest = (req, res) => {
  if (!req.body.content  ) {
    return res.status(400).json({ error: 'Meow! Fill out all fields Pwease~' });
  }

  const contestData = {
    content: req.body.content,
    contest: req.body.contest,
    owner: req.session.account._id,
  };

  const newContest = new Contest.ContestModel(contestData);

  const contestPromise = newContest.save();

  contestPromise.then(() => res.json({ redirect: '/maker' }));

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



module.exports.contestPage = makeContestPage;
module.exports.make = makeContest;
module.exports.getContestsByOwner = getContestsByOwner;
