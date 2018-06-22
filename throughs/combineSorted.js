const Heap = require('heap');

function generalCompare(a, b) {
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
}

function combineSorted(iterators, compare=generalCompare) {
  return async function*() {
    const heads = new Heap(function proxyCompare(a, b) {
      return compare(a.value, b.value);
    });

    // Fetch the heads of all iterators.
    await Promise.all(iterators.map(async function(iterable) {
      const iter = typeof iterable === 'function' ? iterable() : iterable;

      const {value, done} = await iter.next();
      if (!done) {
        heads.insert({value, iter});
      }
    }));

    while (!heads.empty()) {
      const {value, iter} = heads.pop();
      const abort = yield value;
      if (abort) {
        await Promise.all([iter.return(true), ...heads.toArray().map(function ({iter}) {
          return iter.return(true);
        })]);
        return;
      }
      const {value: next, done} = await iter.next();
      if (!done) {
        heads.insert({value: next, iter});
      }
    }
  };
}

module.exports = combineSorted;
