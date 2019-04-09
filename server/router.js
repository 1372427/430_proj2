const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getContests', mid.requiresLogin, controllers.Competition.getContests);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/upgrade', mid.requiresLogin, controllers.Account.upgrade);
  app.post('/pass', mid.requiresLogin, controllers.Account.passChange);
  app.post('/email', mid.requiresLogin, controllers.Account.emailChange);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/home', mid.requiresLogin, controllers.Entry.makePage);
  app.get('/accountInfo', mid.requiresLogin, controllers.Account.accountPage);
  app.get('/makeContest', mid.requiresLogin, controllers.Competition.makePage);
  app.post('/makeEntry', mid.requiresLogin, controllers.Entry.make);
  app.get('/entries', mid.requiresLogin, controllers.Entry.getEntriesByContest);
  app.post('/makeContest', mid.requiresLogin, controllers.Competition.make);
  app.post('/setWinner', mid.requiresLogin, controllers.Competition.setWin);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
