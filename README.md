embrace
=======

Embrace is an adapter that provides a standalone api for rendering and compiling templates.
An additional grunt task is also exposed.

Embrace helps compile and render templates, with or without a data context, register partials,
and copy browser side libraries in to place.

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

#### options.client

Type: `String`

Default: `""`

A directory path where to copy the client side embrace script.

#### options.dust.client

Type: `String`

Default: `""`

A directory path where to copy the dust client side library.

#### options.render

Type: `Boolean`

Default: `true`

Render files with the given context.

#### options.compile

Type: `Boolean`

Default: `false`

Precompile files into javascript.

#### options.data

Type: `String`

Default: `""`

A globbing pattern that collects `*.json` files.

These will be merged into a global context and will be passed to each template.
The file names will be used for root field names.

#### options.resolve

Type: `String`

Default: `""`

The path part that will be ignored when looking up partials.

If you match partials `"nested/folder/partials/*.mustache"`
you would have to refer partials in your templates with their full path: `{{>nested/folder/partials/apartial}}`
With this option, you can set a path part that will be excluded from partial resolution.
E.g. `partialsRoot: "nested/folder/partials/"`. Now you can just refer to templates as `{{>apartial}}`

#### options.partials

Type: `String`

Default: `""`

A globbing pattern that collects template files.
The pattern is relative to the `resolve` options.

Include/import/partial paths will be looked among these files.

#### options.cache

Type: `Boolean`

Default: `false`

Embrace loads template files once and returns the same content every time it is requested if this option is true.
False by default, because the main reason of this module is to use it with a watch task.

#### options.setup

Type: `Function`

Default: `null`

A function receiving the template adapter and the embrace object `setup(Adapter adapter, Object embrace)`

### Compile

```js

  grunt.initConfig({
    embrace: {
      options: {
        client: "test/embrace/",
        data: "test/data/*.json",
        resolve: "test/partials/",
        partials: "**/*.dust",
        cache: false,
        dust: {
          helpers: "",
          client: "test/embrace/"
        },
        setup: function( adapter, embrace ){}
      },
      compileDust: {
        options: {compile: true},
        expand: true,
        cwd: "test/",
        src: ["**/*.dust"],
        dest: "test/compiled/",
        ext: ".js"
      },
      compileAndConcatDust: {
        options: {
          compile: true,
          concat: true
        },
        files: {
          "test/compiled/partials.dust.js": "test/partials/**/*.dust",
          "test/compiled/templates.dust.js": "test/templates/**/*.dust"
        }
      }
    }
  })

```

### Render

```js

  grunt.initConfig({
    embrace: {
      options: {
        client: "test/embrace/",
        data: "test/data/*.json",
        helpers: "test/helpers/dust/*.js",
        resolve: "test/partials/",
        partials: "**/*.dust",
        dust: {
          helpers: "",
          client: "test/embrace/"
        },
        setup: function( adapter, embrace ){}
      }
      renderDust: {
        options: {render: true},
        expand: true,
        cwd: "test/templates",
        src: ["*.dust"],
        dest: "test/rendered/"
      }
    }
  })

```

## Licence

MIT