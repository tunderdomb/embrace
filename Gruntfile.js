module.exports = function ( grunt ){

  grunt.initConfig({
    embrace: {
      options: {
        render: true,
        compile: false,
        data: "test/data/*.json",
        partialsRoot: "test/partials/",
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
      },
//      compile: {
//        options: {
//          compile: true
//        },
//        cwd: "test/templates",
//        src: "*.mustache",
//        dest: "test/compiled"
//      }
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