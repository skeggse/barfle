'use strict';

module.exports = function drain() {
  return async function(iterator) {
    for await (const value of iterator);
  };
};
