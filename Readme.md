# simpleparser

Client wanted current, existing contractors to have a go at the latest screening test. Having escaped from having to do a tech test for this client originally, I thought I'd have a crack at it. 

On my first attempt I went for a beautiful recursive descent parser. That was nice. Of course, the output didn't match the acceptance criteria because it had operator prescedence rather than left directional precedence. 

In the end I hacked it. Pretty glad I've already got this particular contract, to be honest. 

## Installation

Download and install Node. Then install all the dev dependencies required for running tests.

    $ npm install
    $ npm install -g grunt-cli
    
## Running the tests:

    $ grunt test
