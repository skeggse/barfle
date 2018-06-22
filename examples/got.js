const {pull, from, map, reduce, deadline, head} = require('../');
const got = require('got');

(async() => {
  const stream = pull(
    from([1, 2]),
    map((index) => `https://raw.githubusercontent.com/skeggse/barfle/master/examples/fixtures/sample-${index}.txt`),
    map(async (url) => (await got(url)).body),
    deadline(10000),
    reduce((a, b) => `${a} ${b}`));

  try {
    const {value} = await stream.next();
    console.log(value); // prints "Hello world"
  } catch (err) {
    console.error('the stream failed');
    throw err;
  }
})();
