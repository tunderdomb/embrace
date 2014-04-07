module.exports = function ( grunt ){

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
      },
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
        src:[
          "test/rendered/**/*",
          "test/compiled/**/*"
        ]
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