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
  it('should throw "failed to parse operator" for any lexeme{ type: operator, value x }', function() {
    expect(function () { parse([new Lexeme('operator', '+')]) }).to.throw('failed to parse operator')
  })
  it('should return the corresponding root of the AST for any valid tokenized array (test 1)', function () {
    expect(parse([new Lexeme('constant', '10'), new Lexeme('operator', '+'), new Lexeme('variable', 'x')])).to.deep.equal(
      new ASTOperator('+', new ASTConstant('10'), new ASTConstant('x'))
    )
  })
  it('should return the corresponding root of the AST for any valid tokenized array (test 2)', function () {
    expect(parse([
      new Lexeme('constant', '10'),
      new Lexeme('operator', '*'),
      new Lexeme('leftParenthesis', '('),
      new Lexeme('variable', 'x'),
      new Lexeme('operator', '+'),
      new Lexeme('constant', '100'),
      new Lexeme('rigthParenthesis', ')')
    ])).to.deep.equal(
      new ASTOperator('*', new ASTConstant('10'), new ASTOperator('+', new ASTVariable('x'), new ASTConstant('100')))
    )
  })
})
