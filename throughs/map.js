'use strict';

function map(mapper) {
  return async function*(iterator) {
    for await (const value of iterator) {
      const abort = yield mapper(value);
      if (abort) {
        await iterator.return(true);
        break;
      }
    }
  };
}

module.exports = map;
