const colors = require('colors');


module.exports = (vorpal, config) => {
  vorpal
    .command('login <email>', 'Login to CodeReview.')
    .action(function(args, callback) {
      this.prompt({
        type: 'password',
        name: 'password',
        message: 'Password: '
      }, ({ password }) => {
        const body = {
          user: {
            email: args.email,
            password: password
          }
        };

        config.SERVICE.ajax.post(config.AUTH, body).then((data) => {
          if (!data || data.status === 404) {
            this.log(colors.red('[error] Invalid user\'s credentials.'));
            callback();
          } else {
            vorpal.localStorage.setItem('jwt', data.token);
            this.log(colors.green('[ok] Successfully!'));
            callback();
          }
        });
      });
    });
};
