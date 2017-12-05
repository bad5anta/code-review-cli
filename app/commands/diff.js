const getDiff = require('../utils/get-diff');
const Diff2Html = require('diff2html').Diff2Html;
const colors = require('colors');

module.exports = (vorpal, config) => {
  const stackList = config.SERVICE.stack.getList().map((t) => {
    t.attributes.name = t.attributes.name.replace(/\s+/g, '_');
    return t;
  });

  vorpal
    .command('diff <commitFrom> [commitTo] [path]', 'Makes a diff and push to server.')
    .option('-s, --stack <stack>', 'Specify stack.', stackList.map((t) => t.attributes.name))
    .action(function(args, callback) {
      const stack = args.options.stack;

      const stackModel = stack ? stackList.find((t) => {
        return t.attributes.name === stack;
      }) : null;

      if (!stackModel) {
        this.log(colors.red('[error] Please specify stack, for example: diff -t RoR ...'));
        callback();
        return;
      }

      const jwt = vorpal.localStorage.getItem('jwt');

      if (!jwt) {
        this.log(colors.yellow('[deny] This command requires authorization. Please use "login" command before.'));
        callback();
        return;
      }

      getDiff(this, args.commitFrom, args.commitTo, args.path).then((raw) => {
        if (raw) {
          const outputJSON = Diff2Html.getJsonFromDiff(raw);

          const diff = {
            code_changes: JSON.stringify(outputJSON),
            stack_id: stackModel.id
          };
          this.log(colors.blue('[info] Sending to server...'));

          config.SERVICE.ajax.post('/diffs', diff, {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }).then((res) => {
            if(!res) {
              this.log(colors.red('[error] It seems, the user has no reviewers'));
            } else {
              this.log(colors.green('Success! Diff has been pushed!'));
            }
            callback();
          });

        } else {
          this.log(colors.yellow('[warn] Empty diff.'));
          callback();
        }

      }, (err) => {
        this.log(colors.red(`[error] ${err}`));
        callback();
      });
    });
};
