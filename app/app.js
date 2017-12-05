module.exports = () => {
  const Vorpal = require('vorpal');
  const vorpal = Vorpal();

  const config = require('./config')(process.env.CODEREVIEW_ENV);

  config.SERVICE = {
    ajax: require('./services/ajax')(vorpal, config)
  };

  const LoginCommand = require('./commands/login');
  const DiffCommand = require('./commands/diff');
  const StacksCommand = require('./commands/stacks');
  const stack = require('./services/stack')(vorpal, config);

  config.SERVICE.stack = stack;

  // Init localStorage
  vorpal.localStorage('codereview');

  // fetch techs async
  stack.fetchList().then(() => {
    LoginCommand(vorpal, config);
    DiffCommand(vorpal, config);
    StacksCommand(vorpal, config);

    vorpal
      .delimiter('codereview$')
      .show()
      .parse(process.argv);
  });
};