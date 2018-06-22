'use strict';

function errorOut() {
  throw new Error('deadline was reached');
}

function deadline(delay, atDeadline=errorOut) {
  let cancelled = false, timeout, sentinel = {};
  const timer = new Promise(function(resolve) {
    timeout = setTimeout(function() {
      cancelled = true;
      resolve(sentinel);
    }, delay);
  });
  return async function*(iterator) {
    if (cancelled) {
      return atDeadline();
    }

    const result = await Promise.race([iterator.next(), timer]);

    // We've timed out - time to try to abort.
    if (result === sentinel) {
      await iterator.return(true);
      return atDeadline();
    }

    clearTimeout(timeout);
    timeout = null;

    const {value, done} = result;
    if (done) {
      return;
    }

    // TODO: find a neat way to wrap all this up in a bow
    const abort = yield value;
    if (abort) {
      await iterator.return(true);
      return;
    }
    for await (const value of iterator) {
      const abort = yield value;
      if (abort) {
        await iterator.return(true);
        break;
      }
    }
  };
}

module.exports = deadline;
