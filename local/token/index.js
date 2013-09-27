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
