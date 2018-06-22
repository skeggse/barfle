'use strict';

function head(count=1) {
  return async function*(iterator) {
    for await (const value of iterator) {
      const abort = yield value;
      if (abort || !--count) {
        await iterator.return(true);
        break;
      }
    }
  };
}

module.exports = head;
