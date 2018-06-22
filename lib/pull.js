/**
 * Pull values from the origin through the readers. The origin can either be a
 * source (a call directly produces an optionally Promise-wrapped value), or a
 * through (a call that expects an iterator that has
 */
function pull(origin, ...readers) {
  if (typeof origin === 'function' && origin.length === 1) {
    return async function*(read) {
      // Explicitly forbid calling this function multiple times.
      if (readers === null) {
        throw new Error('reader pipeline has already been constructed!');
      }

      const localReaders = readers;
      readers = null;

      return pull(read, ...localReaders);
    };
  }

  let iterator = origin();

  for (const reader of readers) {
    iterator = reader(iterator);
  }

  return iterator;
}

module.exports = pull;
