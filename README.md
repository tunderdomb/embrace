embrace
=======


Embrace is an adapter that provides a standalone api for rendering and compiling templates.
An additional grunt task is also exposed.

## Engines

### Mustache

Mustache is a mature and robust template language.
Its simple syntax and logic-less nature is perfect for short tasks.

### Handlebars

As an extension of mustache, it provides a bit more, but maintains the syntax.

### Dust

right now, Dust is unusable in modern versions of Node
because [this line](https://github.com/akdubya/dustjs/blob/master/lib/server.js#L6)
throws
```
Error: require.paths is removed. Use node_modules folders, or the NODE_PATH environment variable instead
```
the [related issue](https://github.com/akdubya/dustjs/pull/62) is a whole year old now
but [linkedin picked up the project](https://github.com/linkedin/dustjs)
and their fork seems to be even better and improved than the original

### Swig

Swig is a powerful template language with a lot of features that are really useful,
but hard to find in other engines. Such as template inharitance.


## API

Doc coming soon..

## Grunt task

Detailed doc coming soon..
Check the test in the repo!

## Licence

MIT