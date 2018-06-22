const pull = require('..');

pull(
  pull.combineSorted([
    pull.from([1, 5, 5]),
    pull.from([3, 4, 6, 7])
  ]),
  pull.head(5),
  pull.map(console.log),
  pull.drain())

  .catch((err) => console.error(err));
