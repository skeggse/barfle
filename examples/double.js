const pull = require('..');

pull(
  pull.from([1, 2, 3]),
  pull.map((v) => v * 2),
  pull.drain(console.log))

  .catch((err) => console.error(err));
