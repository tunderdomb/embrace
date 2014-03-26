/*
 * grunt-embrace
 * https://github.com/tunderdomb/grunt-embrace
 *
 * Copyright (c) 2014 tunderdomb
 * Licensed under the MIT license.
 */

var async = require("async")
var embrace = require("../embrace")

module.exports = function ( grunt ){
  grunt.registerMultiTask("embrace", "Render mustache templates", function (){

    var options = this.options({
      render: true,
      compile: false,
      partialsRoot: "",
      partials: "",
      data: "",
      mustache: "",
      handlebars: "",
      dust: "",
      swig: "",
      setup: null
    })

    if ( !options.render && !options.compile ) {
      console.log("Nothing to embrace..")
      return
    }

    var templates = embrace(options.setup)

    templates.addPartials(grunt.file.expand(options.partials), options.partialsRoot)
    templates.data(grunt.file.expand(options.data))

    templates.mustache(grunt.file.expand(options.mustache))
    templates.handlebars(grunt.file.expand(options.handlebars))
    templates.dust(grunt.file.expand(options.dust))
    templates.swig(grunt.file.expand(options.swig))


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
        templates.compile(src, content, function( err, compiled ){
          if( !err ) grunt.file.write(file.dest, compiled)
        })
      }
      else {
        templates.render(src, content, function( err, rendered ){
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
      done(err ? err : false)
    })
  })
};
