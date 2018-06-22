'use strict';

function errorOut() {
  throw new Error('timeout was reached');
}

function readTimeout(delay, atDeadline=errorOut) {
  let timeout, sentinel = {};
  function makeTimer() {
    return new Promise(function(resolve) {
      timeout = setTimeout(function() {
        resolve(sentinel);
      }, delay);
    });
  }
  return async function*(iterator) {
    for (;;) {
      const result = await Promise.race([iterator.next(), makeTimer()]);

      if (result === sentinel) {
        await iterator.return(true);
        return atDeadline();
      }

      clearTimeout(timeout);
      timeout = null;

      const {value, done} = result;
      if (done) {
        break;
      }

      const abort = yield value;
      if (abort) {
        await iterator.return(true);
        break;
      }
    }
  };
}

module.exports = readTimeout;
