

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("token/index.js", function(exports, require, module){
// Because of the simplicity of this particular syntax, we can 
// categorise each token rather simply...

var Token = function( input ){

	if(typeof input === "number"){

		this.type = "int";
		this.value = input;

	}else if(input === "a"){

		this.type = "add";
		this.value = "+";

	}else if(input === "b"){

		this.type = "sub";
		this.value = "-";

	}else if(input === "c"){

		this.type = "mul";
		this.value = "*";

	}else if(input === "d"){

		this.type = "div";
		this.value = "/";

	}else if(input === "e"){

		this.type = "open";
		this.value = "(";

	}else if(input === "f"){

		this.type = "closed";
		this.value = ")";

	}else{

		throw new Error("Invalid Token");

	}

	return this;

}

// export a function to tokenise a string...
module.exports.tokenise = function( str ){

	// create an empty array;
	var tokens = [];
	// create an empty string used to buffer individual digits
	var intString = "";
	// split the string into an array of individual characters
	var a = str.split('');
	// iterate over each individual character..
	a.forEach( function( c ){

		if( /[0-9]/.test( c ) ){
			// if the character is a digit, append to the int string buffer;
			intString += c;    

		}else{
			// it's not a digit. If the int string buffer has something in it, flush to the tokens array
			if(intString!==""){

				tokens.push( new Token( parseInt( intString, 10 ) ) );
				intString = "";   

      		}
      		// add the current, non-digit token to the array.
			tokens.push( new Token(c) );
		}

	} );

	if(intString!==""){

		tokens.push( new Token( parseInt( intString, 10 ) ) );
		intString = "";   

    }

	return tokens;

}

});
require.register("parser/index.js", function(exports, require, module){
var methods = {
	"+" : function( a, b ){

		return a + b;

	},
	"-" : function( a, b ){

		return a - b;

	},
	"*" : function(a, b){

		return a * b;

	},
	"/" : function(a, b){

		return a / b;

	}

};


var pointer;


var flatten = function( tokens, index ){

	var i = 0;

	while(tokens[i] && tokens[i + 1]){

		if(tokens[++i].type==="open"){

			var temp = tokens.slice(i)

			tokens.splice( i, tokens.length );
			tokens = tokens.concat( flatten( temp ) );

			//console.log(flatten(tokens.slice(i)));

		}

		if(tokens[i].type==="closed"){

			var temp = tokens.slice(1, i);



			return compute(temp).concat(tokens.slice(i + 1));

		}


	}

	return tokens;

}

// this function computes the binary operation.
var compute = function( tokens ){

	while(tokens.length > 1){
		// evaluate a binary operation.
		if(tokens[0].type==="int" && tokens[2].type==="int" && methods[tokens[1].value]){
			// replace the operation with the result.
  			tokens.splice( 0,3, { type : "int", value : methods[tokens[1].value](tokens[0].value, tokens[2].value)} )
		} else{

			tokens = [];

		}


	}

	return tokens;

}


var evaluate = function( str ){

	var tokens = require('token').tokenise( str );


	var result = compute(flatten(tokens));

	return result[0].value;
}

module.exports = {
	evaluate : evaluate
};
});
require.alias("token/index.js", "parser/deps/token/index.js");

