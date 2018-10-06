const moment = require('moment');

const generateMessage = (from, text) => {
  return {
    from,
    text,
    time: moment().valueOf()
  };
};

module.exports = {generateMessage};
