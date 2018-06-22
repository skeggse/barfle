barfle
======

A minimal utility belt for streaming with async iterables.

This is an experimental package which recreates [`pull-stream`s][pull-stream]
using [asynchronous iterators], which are available in Node 10.

We aim to retain many of the nice properties of `pull-stream`s, without
sacrificing usability.

## Example

```js
import pull, {from, map, reduce, head} from 'barfle';
import got from 'got';

const stream = pull(
  from([1, 2]),
  map((index) => `https://raw.githubusercontent.com/skeggse/barfle/master/examples/fixtures/sample-${index}.txt`),
  map(async (url) => (await got(url)).text),
  deadline(10000),
  reduce((a, b) => `${a} ${b}`));

const {value} = await stream.next();
console.log(value); // prints "Hello World"
```

## What's missing?

We don't yet have the preemptive abort semantics that `pull-stream` provides.
Namely, an abort signal does not propagate through things like the `reduce`
through, because it reads from its upstream until exhausted. This breaks the
`deadline` through, which tries to abort the upstream if it hasn't produced a
within a given time delay. This limitation arises because the implicit
backpressure runs both directions, and the `yield` that _should_ signal an abort
doesn't get read by the upstream iterator until it goes to produce a new value.

The core library isn't fleshed out, and needs several more primitives before it
can be considered useful. Nothing is well documented, even in inline
documentation.

Also we don't have tests. We need those.

## Why name this package "barfle?"

There are already a lot of packages with names that include "async," "promise,"
and "stream" on the `npm` registry, and I gave up looking for one that felt
right. The word `barfle`  (pronounced ['bar,flɛ]) roughly translates as an
'outflow stream' in [Lojban].

[asynchronous iterators]: https://github.com/tc39/proposal-async-iteration
[Lojban]: https://mw.lojban.org/papri/Lojban
[pull-stream]: https://pull-stream.github.io/
