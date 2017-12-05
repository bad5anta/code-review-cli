const { spawn } = require('child_process');


module.exports = (context, commitFrom, commitTo, path) => {
  return new Promise((resolve, reject) => {
      let isSuccess = true;
      const chunks = [];
      const gitDiffArgs = ['diff', commitFrom];

      if (commitTo) {
        gitDiffArgs.push(commitTo);
      }

      if (path) {
        gitDiffArgs.push('--');
        gitDiffArgs.push(path);
      }

      const child = spawn('git', gitDiffArgs);

      child.stdout.setEncoding('utf8');
      child.stdout.on('data', (chunk) => {
        chunks.push(chunk);
      });

      child.stderr.on('data', (chunk) => {
        context.log(colors.red(`[error] ${chunk}`));
        isSuccess = false;
      });

      child.on('close', () => {
        if (isSuccess) {
          resolve(chunks.join(''));
        } else {
          reject();
        }
      });
    });
};