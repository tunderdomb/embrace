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

Doc coming soon.. until then, the source is commented where it's applicable.

## Grunt task

### options

#### render

Type: `Boolean`

Default: `true`

Render files with the given context.

#### compile

Type: `Boolean`

Default: `false`

Precompile files into javascript.

#### data

Type: `String`

Default: `""`

A globbing pattern that collects `*.json` files.

These will be merged into a global context and will be passed to each template.
The file names will be used for root field names.

#### partials

Type: `String`

Default: `""`

A globbing pattern that collects template files.

Iclude/import/partial paths will be looked among these files.

#### partialsRoot

Type: `String`

Default: `""`

The path part that will be ignored when looking up partials.

If you match partials `"nested/folder/partials/*.mustache"`
you would have to refer partials in your templates with their full path: `{{>nested/folder/partials/apartial}}`
With this option, you can set a path part that will be excluded from partial resolution.
E.g. `partialsRoot: "nested/folder/partials/"`. Now you can just refer to templates as `{{>apartial}}`

#### helpers

Type: `String`

Default: `""`

A globbing pattern that collects `*.js` files.

Not yet implemented.

Detailed doc coming soon..
Check the test in the repo!

```js

grunt.initConfig({
  embrace: {
    options: {
      render: true,
      compile: false,
      data: "test/data/*.json",
      partials: "test/partials/**/*.*",
      mustache: "test/helpers/mustache/*.js",
      handlebars: "test/helpers/handlebars/*.js",
      dust: "test/helpers/dust/*.js",
      swig: "test/helpers/swig/*.js"
    },
    render: {
      expand: true,
      cwd: "test/templates",
      src: [
        "*.mustache",
        "*.hbs",
        "*.swig",
        "*.dust"
      ],
      dest: "test/rendered/"
    }
  }
})

```

## Licence

MIT