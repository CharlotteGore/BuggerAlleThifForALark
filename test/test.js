var parser = require('../index.js');
var chai = require('chai');
var should = chai.should();

describe('Simple Mathematical Parser Screening', function () {

  it('evaluates 2a2 as 4', function () {

      parser.evaluate("2a2").should.equal(4);
  });

  it('evaluates 3a2c4 as 20', function () {

      parser.evaluate("3a2c4").should.equal(20);
  });

  it('evaluates 32a2d2 as 17', function () {
      parser.evaluate("32a2d2").should.equal(17);
  });

  it('evaluates 500a10b66c32 as 14208', function () {
      parser.evaluate("500a10b66c32").should.equal(14208);
  });

  it('evaluates 3ae4c66fb32 as 235', function () {
      parser.evaluate("3ae4c66fb32").should.equal(235);
  });

  it('evaluates 3c4d2aee2a4c41fc4f as 990', function () {
      parser.evaluate("3c4d2aee2a4c41fc4f").should.equal(990);
  });

});