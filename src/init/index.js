const initOwnerAcc = require('./initOwnerAcc');
const colors = require('colors');

module.exports = async function init() {
  console.log(colors.green('= Init processing'));

  try {
    if (process.env.INIT_OWNER_ACC === "true") {
      try {
        await initOwnerAcc();
      } catch (error) {
        console.log(colors.red('❌ Init owner acc failed: ' + error.message));
      }
    }

    console.log(colors.green('= Init process done'));
  } catch (error) {
    console.log(colors.red('❌ Init process failed: ' + error.message));
  }
}