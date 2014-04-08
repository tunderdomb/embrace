var path = require("path")
var fs = require("fs")
var mkdirp = require("mkdirp")

/**
 * @return {Adapter}
 * */
function embrace( setup ){
  return new Adapter(setup)
}

module.exports = embrace

var mustache = embrace.mustache = require("mustache")
var handlebars = embrace.handlebars = require("handlebars")
var swig = embrace.swig = require("swig")
var dust = embrace.dust = require("dustjs-linkedin")

function copy( src, dest ){
  mkdirp.sync(path.dirname(dest))
  fs.createReadStream(src)
    .pipe(fs.createWriteStream(dest))
  console.log("Embraced client: '%s'", dest)
}

function enginePath( engineName, file ){
  return path.join(__dirname, "engines", engineName, file)
}

embrace.copyEngine = function ( engine, dest ){
  function doCopy( clientScript ){
    var destScript = path.join(process.cwd(), dest, clientScript)
    if ( !fs.existsSync(destScript) ) {
      copy(enginePath(engine, clientScript), destScript)
    }
  }

  switch ( engine ) {
    case "mustache":
      break
    case "handlebars":
      break
    case "dust":
      [
        "dust-core.js", "dust-core.min.js", "dust-full.js", "dust-full.min.js"
      ].forEach(doCopy)
      break
    case "swig":
      [
        "swig.js", "swig.min.js"
      ].forEach(doCopy)
      break
  }
}

embrace.copyClient = function ( dest ){
  dest = path.join(process.cwd(), dest, "embrace.js")
  if ( !fs.existsSync(dest) ) {
    copy(path.join(__dirname, "dist", "embrace.js"), dest)
  }
}

/**
 * @param src {String}
 * @param [content]{String}
 * */
embrace.detectEngine = function ( src, content ){
  src = path.extname(src).replace(".", "")
  content = content || ""
  switch ( true ) {
    case src == "mustache":
    case src == "hbs":
    case src == "dust":
    case src == "swig":
      return src
    case content.match(/{%[^%]+?%}/):
      return "swig"
    case content.match(/{[^}]+?}/):
      return "dust"
    default:
      throw new Error("Unknown engine: '" + src + "'")
  }
}

embrace.read = function ( src ){
  try {
    return fs.readFileSync(src, "utf8")
  }
  catch ( e ) {
    return null
  }
}

embrace.nameOf = function ( src ){
  return path.basename(src, path.extname(src))
}

embrace.extend = function ( obj, extension ){
  for ( var prop in extension ) {
    obj[prop] = extension[prop]
  }
  return obj
}

embrace.merge = function ( obj, extension ){
  var ret = {}
    , prop
  for ( prop in obj ) {
    ret[prop] = obj[prop]
  }
  for ( prop in extension ) {
    ret[prop] = extension[prop]
  }
  return ret
}

embrace.loadPartial = function ( partials, partialName, engine, src, cache ){
  var content = null
  partials.some(function ( partial ){
    if ( partial.name == partialName && partial.engine == engine ) {
      if ( !cache || partial.content === null ) {
        content = embrace.read(partial.src)
        if ( cache && content != null ) {
          // make an actual object out of the template string
          // so it can be passed around by reference
          // because string primitives would be copied every time
          // let's hope it doesn't throw off engines
          // if they only do `typeof x != "string" -> Error..` at some point
          partial.content = new String(content)
        }
      }
      else {
        content = partial.content
      }
      return true
    }
    return false
  })
  if ( content == null ) {
    throw new Error("Partial '" + partialName + "' not found in '" + src + "'")
  }
  return content || ""
}

/**
 * resolve a partial name to a proper path part
 * @example
 *
 * var root = "res/partials/"
 *   , src = "res/partials/services/blabla.mustache"
 * resolvePartialName( src, root ) -> services/blabla
 *
 * @param src{String} the full partial source from the partials list (Adapter.partials)
 * @param root{String} the partials' root folder
 * */
embrace.resolvePartialName = function ( src, root ){
  if ( !root ) return src
  root = (root).replace(/\/+$/, "")
  src = src.replace(root, "").replace(/^\/|\.\w*?$/g, "")
  return src
}

/** ====================
 *  Renders
 *
 *  these methods doesn't need to be part of the public API
 *  but for the sake of modularity, they are in a hash
 *  they are executed in the context of a Adapter object
 * ==================== */
var render = embrace.render = {}

render.mustache = function ( src, content, done ){
  done(null, mustache.render(content, this.context, function ( partialName ){
    // mustache doesn't seem to have any caching mechanism for partials
    // the most we can do is load the file once
    return embrace.loadPartial(this.partials, partialName, "mustache", src)
  }.bind(this)))
}

render.hbs = function ( src, content, done ){
  done(null, handlebars.compile(content)(this.context))
}

render.dust = function ( src, content, done ){
  var name = path.basename(src, path.extname(src))
  var adapter = this
  adapter.currentDustTemplate = src
  var tpl = dust.loadSource(dust.compile(content, name))
  if ( !adapter.cache ) {
    dust.cache[name] = tpl
  }
  dust.render(name, adapter.context, function ( err, out ){
    done(err, out)
    delete adapter.currentDustTemplate
  })
}

render.swig = function ( src, content, done ){
  this.currentSwigTemplate = src
  done(null, swig.render(content, {
    locals: this.context
  }))
  delete this.currentSwigTemplate
}

/** ====================
 *  Compilers
 * ==================== */
var compile = embrace.compile = {}

compile.mustache = function ( src, content, done ){

}

compile.hbs = function ( src, content, done ){
//  var template = Handlebars.compile(content)
//  template(context)
}

compile.dust = function ( src, content, done ){
  var partial = this.getPartialBySrc(src)
    , name
  if ( partial ) {
    name = partial.name
  }
  else {
    name = embrace.nameOf(src)
  }
  var compiled = dust.compile(content, name)
  done(null, compiled)
}

compile.swig = function ( src, content, done ){

}

/**
 * Adapter
 * constructor for a template object
 * */
function Adapter( options ){
  options = options || {}
  var adapter = this

  this.resolve = options.resolve || ""
  this.cache = !!options.cache

  this.context = {}
  this.partials = []
  this.currentSwigTemplate = null
  this.currentDustTemplate = null

  // swig dynamic template loader
  swig.setDefaults({ loader: {
    /**
     * Loads a single template. Given a unique identifier found by the resolve method this should return the given template.
     *
     * @param identifier{String} Unique identifier of a template (possibly an absolute path).
     * @param [cb]{Function} Asynchronous callback function. If not provided, this method should run synchronously.
     * */
    load: function ( identifier, cb ){
      return embrace.loadPartial(adapter.partials, identifier, "swig", adapter.currentSwigTemplate, adapter.cache)
      // cb(err, content)
    },
    /**
     * Resolves to to an absolute path or unique identifier. This is used for building correct, normalized, and absolute paths to a given template.
     *
     * @param to{String} Non-absolute identifier or pathname to a file.
     * @param [from]{String}  If given, should attempt to find the to path in relation to this given, known path.
     * */
    resolve: function ( to, from ){
      to = to.replace(/\.\w*?$/, "")
      return to
    }
  }})

  // By default Dust returns a "template not found" error
  // when a named template cannot be located in the cache.
  // Override onLoad to specify a fallback loading mechanism
  // (e.g., to load templates from the filesystem or a database).
  dust.onLoad = function ( name, cb ){
    cb(null, embrace.loadPartial(adapter.partials, name, "dust", adapter.currentDustTemplate, adapter.cache))
  }
  if ( !adapter.cache ) {
    // overwrite default dust caching
    dust.register = function ( name, tmpl ){}
  }

  options.setup && options.setup(this, embrace)
}

/**
 * @param locations{String[]} a list of partial file paths
 * @param [root]{String} partials root folder
 * */
Adapter.prototype.addPartials = function ( locations ){
  locations.forEach(function ( src ){
    var partial = {
      src: src,
      name: embrace.resolvePartialName(src, this.resolve),
      engine: embrace.detectEngine(src),
      content: null
    }
    if ( partial.engine == "hbs" ) {
      // It's regretful, but Handlebars doesn't support dynamic partial loading
      // It should thou, since it's an extension of Mustache, which does..
      // At least it throws off itself if it doesn't find a partial,
      // in that case the control doesn't even reach this code.
      // So we register a phantom function that poses as a compiled template
      // and it executes when a partial needs to be parsed
      // loads and compiles the needed file once, caches the template function
      // then returns the rendered result
      var compiled
      handlebars.registerPartial(partial.name, function (){
        partial.content = partial.content || embrace.read(partial.src)
        compiled = compiled || handlebars.compile(partial.content)
        return compiled.apply(handlebars, arguments)
      })
    }
    else {
      this.partials.push(partial)
    }
  }, this)
}

Adapter.prototype.getPartialByName = function ( name ){
  var partial = null
  this.partials.some(function ( p ){
    if ( p.name === name ) {
      partial = p
      return true
    }
    return false
  })
  return partial
}
Adapter.prototype.getPartialBySrc = function ( src ){
  var partial = null
  this.partials.some(function ( p ){
    if ( p.src === src ) {
      partial = p
      return true
    }
    return false
  })
  return partial
}

/** ====================
 *  helper/filter registrators
 * ==================== */
Adapter.prototype.helpMustache = function ( sources ){
  sources.forEach(function ( src ){

  })
}
Adapter.prototype.helpHandlebars = function ( sources ){
  sources.forEach(function ( src ){

  })
}
Adapter.prototype.helpDust = function ( sources ){
  sources.forEach(function ( src ){

  })
}
Adapter.prototype.helpSwig = function ( sources ){
  sources.forEach(function ( src ){

  })
}

/**
 * @param sources{String[]} .json file paths
 * */
Adapter.prototype.data = function ( sources ){
  var context = this.context
  sources.forEach(function ( file ){
    try {
      context[embrace.nameOf(file)] = JSON.parse(embrace.read(file))
    }
    catch ( e ) {
      console.warn("Invalid data path: '" + file + "'")
    }
  })
}

/** ====================
 *  Render a template
 * ==================== */
Adapter.prototype.render = function ( src, content, done ){
  try {
    render[embrace.detectEngine(src, content)].call(this, src, content, done)
  }
  catch ( e ) {
    done(e)
  }
}

/** ====================
 *  compile a template
 * ==================== */
Adapter.prototype.compile = function ( src, content, done ){
  try {
    compile[embrace.detectEngine(src, content)].call(this, src, content, done)
  }
  catch ( e ) {
    done(e)
  }
}


