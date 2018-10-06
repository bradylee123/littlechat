const isValidString = (input) => {
  return typeof input === 'string' && input.trim().length > 0;
};

module.exports = {isValidString};
