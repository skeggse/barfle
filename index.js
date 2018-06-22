const pull = require('./lib/pull');

Object.assign(pull, {
  pull,

  from: require('./sources/from'),

  combineSorted: require('./throughs/combineSorted'),
  deadline: require('./throughs/deadline'),
  head: require('./throughs/head'),
  map: require('./throughs/map'),
  reduce: require('./throughs/reduce'),

  drain: require('./sinks/drain'),
});

module.exports = pull;
