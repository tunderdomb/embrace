var embrace = (function ( f ){
  return f({})
}(function ( embrace ){

  function request( url, options, done ){
    if ( !done ) {
      done = options
      if ( !done ) throw new Error("Callback required")
      options = {}
    }
    var http = new XMLHttpRequest()
    http.addEventListener("load", function ( e ){
      var response = this.response
      if ( options.json ) {
        try {
          response = JSON.parse(response)
        }
        catch ( e ) {
          done(e)
          return
        }
      }
      done(null, response)
    }, false)
    http.open("GET", url, false)
    http.send()
  }

  function load( src, done ){
    var script = document.createElement("script")
    script.src = src
    script.async = false
    document.head.appendChild(script)
    var ok
    script.onload = function( e ){
      debugger
      ok || done()
      ok = true
    }
    script.onerror = function( e ){
      debugger
      ok || done()
      ok = true
    }
  }

  embrace.load = function( template, done ){
    if ( typeof template == "string" ) {
      load(template, done)
    }
    else {
      var toLoad = template.length
        , i = -1
        , next = function( err ){
          if ( err ) {
            console.warn(err)
          }
          --toLoad
          if ( !toLoad ) {
            done()
          }
        }
      while ( ++i < toLoad ) {
        load(template[i], next)
      }
    }
  }

  return embrace
}))