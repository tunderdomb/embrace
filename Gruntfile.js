module.exports = function ( grunt ){

  grunt.initConfig({
    embrace: {
//      _options: {
//        render: true,
//        compile: false,
//        data: "test/data/*.json",
//        partialsRoot: "test/partials/",
//        partials: "test/partials/**/*.*",
//        mustache: "test/helpers/mustache/*.js",
//        handlebars: "test/helpers/handlebars/*.js",
//        dust: "test/helpers/dust/*.js",
//        swig: "test/helpers/swig/*.js"
//      },
      options: {
        data: "test/data/*.json",
        helpers: "test/helpers/dust/*.js",
        resolve: "test/partials/",
        partials: "**/*.dust",
        setup: function( adapter, embrace ){

        }
      },
//      compileDust: {
//        options: {compile: true},
//        expand: true,
//        cwd: "test/templates",
//        src: ["*.dust"],
//        dest: "test/compiled/",
//        ext: ".js"
//      },
      renderDust: {
        options: {render: true},
        expand: true,
        cwd: "test/templates",
        src: ["*.dust"],
        dest: "test/rendered/"
      }
    },
    clean: {
      test: {
        src:[ "test/rendered/**/*",  "test/compiled/**/*"]
      }
    },
    dir: {
      "src": {
        src: "test/templates/*.*"
      },
      "src-dest": {
        src: "test/templates/*.*",
        dest: "test/rendered"
      },
      "src-expand": {
        expand: true,
        src: "test/templates/*.*"
      },
      "src-dest-expand": {
        expand: true,
        src: "test/templates/*.*",
        dest: "test/rendered"
      },
      "cwd-src-dest-expand": {
        expand: true,
        cwd: "test/templates/",
        src: "*.*",
        dest: "test/rendered"
      }
    }
  })

  grunt.loadTasks("tasks")
  grunt.loadNpmTasks("grunt-contrib-clean")

  grunt.registerTask("default", "", function(  ){
    console.log("Grunt~~")
    grunt.task.run("clean:test")
    grunt.task.run("embrace")
  })

  grunt.registerMultiTask("dir", "", function(  ){
    this.files.forEach(function( filePair ){
      filePair.src.forEach(function( src ){
        console.log(src, " -> ", filePair.dest)
      })
    })
  })

};