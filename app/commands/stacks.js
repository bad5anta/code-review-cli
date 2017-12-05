const colors = require('colors');

module.exports = (vorpal, config) => {
  function stackInfo(stack, isDetailed) {
    if (isDetailed) {
      return JSON.stringify(stack);
    } else {
      return stack.attributes.name.replace(/\s+/g, '_');
    }
  }

  vorpal
    .command('stacks', 'Displays list of stacks.')
    .option('-f, --force', 'Force reload stacks.')
    .option('-d, --detailed', 'Detailed list of stacks (includes IDs).')
    .action(function(args, callback) {
      config.SERVICE.stack.fetchList(args.options.force).then((stacks) => {
        this.log(colors.green('List of stacks:'));

        stacks.forEach((stack) => {
          this.log(colors.blue(`- ${stackInfo(stack, args.options.detailed)}`));
        });

        callback();
      });
    });
};
