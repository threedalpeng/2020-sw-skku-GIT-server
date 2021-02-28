const shell = require('shelljs');
const config = require('../../config/config');

function killProcessesOnInit() {
  console.log('kill processes on init');
  shell.exec(config.path.shell + 'kill_preventra.sh')
};

module.exports = {
  killProcessesOnInit
}