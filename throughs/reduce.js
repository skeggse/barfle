'use strict';

function reduce(reducer, initialValue) {
  if (typeof reducer !== 'function') {
    throw new TypeError('reduce requires a function');
  }

  const hasInitialValue = arguments.length >= 2;
  return async function*(iterator) {
    const {value, done} = await iterator.next();

    if (done && !hasInitialValue) {
      throw new TypeError('reduce given empty upstream with no initial value');
    }

    // If we were provided an initial value, then treat it as the initial
    // accumulator. Otherwise, just pass the first two values from the upstream
    // to the first call of the reducer.
    let lastValue = hasInitialValue
      ? await reducer(initialValue, value)
      : value;

    for await (const value of iterator) {
      const abort = yield reducer(lastValue, value);
      if (abort) {
        await iterator.return(true);
        return;
      }
    }
  };
}

module.exports = reduce;
