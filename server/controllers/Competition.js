const models = require('../models');

const Contest = models.Competition;

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


module.exports.makePage = makeContestPage;
module.exports.make = makeContest;
module.exports.getContestsByOwner = getContestsByOwner;
module.exports.getContestsByDate = getContestsByDate;
