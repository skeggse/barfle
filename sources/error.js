'use strict';

function error(error=new Error('unspecified')) {
  return async function*() {
    throw error;
  };
}

module.exports = from;
