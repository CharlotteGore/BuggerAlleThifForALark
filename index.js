

// does the actual computing...
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


// Recursively find expressions inside nested parenthesis, compute them, return.
var flatten = function( tokens, index ){

	var i = 0;

	while(tokens[i] && tokens[i + 1]){

		if(tokens[++i].type==="open"){

			// genuinely terrifying array munging stuff here. Sorry.

			// get a copy of all the tokens from the ( onwards
			var temp = tokens.slice(i)
			// chop everything from the ( onwards off tokens.
			tokens.splice( i, tokens.length );
			// concat the results of the recursive call to flatten.. 
			tokens = tokens.concat( flatten( temp ) );

		}

		if(tokens[i].type==="closed"){
			// get the expression within the brackets
			var temp = tokens.slice(1, i);
			// compute the expression *now*, append the remaining tokens and return
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
			// this is really an 'avoid infinite loops because of dirty input' catchall
			tokens = [];

		}


	}

	return tokens;

}


var evaluate = function( str ){

	// get the tokens.
	var tokens = require('token').tokenise( str );

	// computer the result
	var result = compute(flatten(tokens));
	// return it in a friendly format.
	return result[0].value;
}

// exports
module.exports = {
	evaluate : evaluate
};