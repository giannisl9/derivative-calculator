const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const Lexeme = require('../lexeme.js')
const parse = require('../parser.js').parse
const ASTClasses = require('../AST/ASTClasses.js')
const ASTOperator = ASTClasses.ASTOperator
const ASTConstant = ASTClasses.ASTConstant
const ASTVariable = ASTClasses.ASTVariable

describe('parse()', function () {
  it('should parse any lexeme{ type: constant, value: x } as an ASTConstant', function () {
    expect(parse([new Lexeme('constant', '10')])).to.deep.equal(new ASTConstant('10'))
    expect(parse([new Lexeme('constant', '10')])).to.be.an.instanceof(ASTConstant.prototype.constructor)
  })
  it('should parse any lexeme{ type: variable, value: x } as an ASTVariable', function () {
    expect(parse([new Lexeme('variable', 'x')])).to.deep.equal(new ASTVariable('x'))
  })
  it('should throw "fail to parse operator" for any lexeme{ type: operator, value x }', function() {
    expect(function () { parse([new Lexeme('operator', '+')]) }).to.throw('failed to parse operator')
  })
})
