/*
 * grunt-embrace
 * https://github.com/tunderdomb/grunt-embrace
 *
 * Copyright (c) 2014 tunderdomb
 * Licensed under the MIT license.
 */

var async = require("async")
var path = require("path")
var embrace = require("../embrace")

module.exports = function ( grunt ){

  function doTheThing( setup, options ){

    var adapter = embrace(setup, options)
    if( options.partials )
      adapter.addPartials(grunt.file.expand(path.join(options.cwd||"",options.partials)), options.cwd)
    if( options.data )
      adapter.data(grunt.file.expand(options.data))

    if( options.mustache )
      adapter.helpMustache(grunt.file.expand(options.mustache))
    if( options.handlebars )
      adapter.helpHandlebars(grunt.file.expand(options.handlebars))
    if( options.dust )
      adapter.helpDust(grunt.file.expand(options.dust))
    if( options.swig )
      adapter.helpSwig(grunt.file.expand(options.swig))
  }

  grunt.registerMultiTask("embrace", "Render mustache templates", function (){

    var options = this.options({
      render: false,
      compile: false,
      data: "",
      helpers: "",
      resolve: "",
      helpMustache: "",
      helpHandlebars: "",
      helpDust: "",
      helpSwig: "",
      setup: null
    })

    if ( !options.render && !options.compile ) {
      console.log("Nothing to embrace..")
      return
    }

    var adapter = embrace(options.setup)

    if( options.partials ){
      var partials = options.resolve
        ? path.join(options.resolve , options.partials)
        : options.partials
      adapter.addPartials(grunt.file.expand(partials), options.resolve)
    }
    if( options.data )
      adapter.data(grunt.file.expand(options.data))

    if( options.helpMustache )
      adapter.helpMustache(grunt.file.expand(options.helpMustache))
    if( options.helpHandlebars )
      adapter.helpHandlebars(grunt.file.expand(options.helpHandlebars))
    if( options.helpDust )
      adapter.helpDust(grunt.file.expand(options.helpDust))
    if( options.helpSwig )
      adapter.helpSwig(grunt.file.expand(options.helpSwig))

    var sources = []

    this.files.forEach(function ( filePair ){
      sources = filePair.src
        .filter(function( src ){
          return grunt.file.exists(src)
        })
        .map(function( src ){
          return {
            src: src,
            dest: filePair.dest
          }
        })
        .concat(sources)
    })

    var done = this.async()

    async.each(sources, function( file, done ){
      var src = file.src
      var content = grunt.file.read(src)

      if ( options.compile ) {
        adapter.compile(src, content, function( err, compiled ){
          if( !err ) grunt.file.write(file.dest, compiled)
        })
      }
      else if( options.render ) {
        adapter.render(src, content, function( err, rendered ){
          if( !err ) {
            grunt.file.write(file.dest, rendered)
            console.log("Rendered '"+file.dest+"'")
          }
          else {
            done(err)
          }
        })
      }
    }, function( err ){
      done(err||false)
    })
  })
};
