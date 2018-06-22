'use strict';

function from(items=[]) {
  return async function*() {
    yield* items;
  };
}

module.exports = from;
