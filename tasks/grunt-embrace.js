/*
 * grunt-embrace
 * https://github.com/tunderdomb/grunt-embrace
 *
 * Copyright (c) 2014 tunderdomb
 * Licensed under the MIT license.
 */

var async = require("async")
var path = require("path")
var fs = require("fs")
var embrace = require("../embrace")

module.exports = function ( grunt ){

  grunt.registerMultiTask("embrace", "Render mustache templates", function (){

    var options = this.options({
      client: "",
      render: false,
      compile: false,
      cache: false,
      data: "",
      resolve: "",
      setup: null
    })

    if ( !options.render && !options.compile ) {
      console.log("Nothing to embrace..")
      return
    }

    var adapter = embrace(options)

    // register partials
    if( options.partials ){
      var partials = options.resolve
        ? path.join(options.resolve , options.partials)
        : options.partials
      adapter.addPartials(grunt.file.expand(partials))
    }

    // register data
    if( options.data ){
      adapter.data(grunt.file.expand(options.data))
    }

    // Register helpers and copy client engines
    if( options.mustache ){
      if( options.mustache.helpers ) {
        adapter.helpMustache(grunt.file.expand(options.mustache.helpers))
      }
      if ( options.mustache.client ) {
        embrace.copyEngine("mustache", options.mustache.client)
      }
    }
    if( options.handlebars ){
      if( options.handlebars.helpers ) {
        adapter.helpHandlebars(grunt.file.expand(options.handlebars.helpers))
      }
      if ( options.handlebars.client ) {
        embrace.copyEngine("handlebars", options.handlebars.client)
      }
    }
    if( options.dust ){
      if( options.dust.helpers ) {
        adapter.helpDust(grunt.file.expand(options.dust.helpers))
      }
      if ( options.dust.client ) {
        embrace.copyEngine("dust", options.dust.client)
      }
    }
    if( options.swig ){
      if( options.swig.helpers ) {
        adapter.helpSwig(grunt.file.expand(options.swig.helpers))
      }
      if ( options.swig.client ) {
        embrace.copyEngine("swig", options.swig.client)
      }
    }

    // copy browser embrace
    if ( options.client ) {
      embrace.copyClient(options.client)
    }

    var sources = []
      , concats = {}

    // prepare files for processing
    this.files.forEach(function ( filePair ){
      sources = filePair.src
        .filter(function( src ){
          return grunt.file.exists(src)
        })
        .map(function( src ){
          return {
            concat: !!options.concat,
            src: src,
            dest: filePair.dest
          }
        })
        .concat(sources)
    })

    var done = this.async()
    // process individual templates
    async.eachSeries(sources, function ( file, next ){
      var src = file.src
      var content = grunt.file.read(src)
      if ( options.compile ) {
        adapter.compile(src, content, function ( err, compiled ){
          if ( !err ) {
            if ( file.concat ) {
              concats[file.dest] = concats[file.dest] || []
              concats[file.dest].push(compiled)
            }
            else {
              grunt.file.write(file.dest, compiled)
              console.log("Compiled '%s'", file.dest)
            }
            next()
          }
          else {
            console.warn(err)
            next(err)
          }
        })
      }
      else if ( options.render ) {
        adapter.render(src, content, function ( err, rendered ){
          if ( !err ) {
            grunt.file.write(file.dest, rendered)
            console.log("Rendered '%s'", file.dest)
            next()
          }
          else {
            console.warn(err)
            next(err)
          }
        })
      }
      else {
        next(new Error("We shouldn't be here.."))
      }
    }, function ( err ){
      if ( !err ) {
        var dest
          , compiledTemplates
        for( dest in concats ){
          compiledTemplates = concats[dest]
          if ( compiledTemplates.length ) {
            grunt.file.write(dest, compiledTemplates.join(";\n"))
            console.log("Compiled '%s'", dest)
          }
        }
      }
      else{
        console.warn(err)
      }
      done(err || true)
    })
  })
};
