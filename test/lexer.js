const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const lex = require('../lexer.js').lex
const Lexeme = require('../lexeme.js')

describe('Lexer', function () {
  describe('#analyze()', function () {
    it('should throw "empty input" when given an empty string', function () {
      expect(function () { lex('') }).to.throw('empty input')
    })
    it('should throw "invalid input" when given a string including any symbol despite [+,-,*,/]', function () {
      let tests = ['%', '$', '10%1', '10#2+3', '10+2!3']
      expect(function () { lex('%') }).to.throw('invalid input')
      expect(function () { lex('$') }).to.throw('invalid input')
      expect(function () { lex('10%1') }).to.throw('invalid input')
      expect(function () { lex('10#2+3') }).to.throw('invalid input')
      expect(function () { lex('10+2!3') }).to.throw('invalid input')
    })
    it('should return an array with a lexeme{ type: constant, value: x } for any number x', function () {
      expect(lex('1')).to.deep.equal([new Lexeme('constant', '1')])
      expect(lex('10')).to.deep.equal([new Lexeme('constant', '10')])
      expect(lex('104')).to.deep.equal([new Lexeme('constant', '104')])
    })
    it('should return an array with a lexeme{ type: variable, value: x } for any variable x', function () {
      expect(lex('x')).to.deep.equal([new Lexeme('variable', 'x')])
      expect(lex('x')[0]).to.be.an.instanceof(Lexeme.prototype.constructor)

      expect(lex('k')).to.deep.equal([new Lexeme('variable', 'k')])
      expect(lex('x')[0]).to.be.an.instanceof(Lexeme.prototype.constructor)
    })
    it('should return an array with a lexeme{ type: operator, value: x } for any operator x:[+,-,*,/]', function () {
      expect(lex('+')).to.deep.equal([new Lexeme('operator', '+')])
      expect(lex('+')[0]).to.be.an.instanceof(Lexeme.prototype.constructor)

      expect(lex('-')).to.deep.equal([new Lexeme('operator', '-')])
      expect(lex('-')[0]).to.be.an.instanceof(Lexeme.prototype.constructor)

      expect(lex('*')).to.deep.equal([new Lexeme('operator', '*')])
      expect(lex('*')[0]).to.be.an.instanceof(Lexeme.prototype.constructor)

      expect(lex('/')).to.deep.equal([new Lexeme('operator', '/')])
      expect(lex('*')[0]).to.be.an.instanceof(Lexeme.prototype.constructor)
    })
    it('should return an array with a lexeme{ type: leftParenthesis, value: ( } for left parenthesis', function () {
      expect(lex('(')).to.deep.equal([new Lexeme('leftParenthesis', '(')])
      expect(lex('(')[0]).to.be.an.instanceof(Lexeme.prototype.constructor)
    })
    it('should return an array with a lexeme{ type: rightParenthesis, value: ) } for right parenthesis', function () {
      expect(lex(')')).to.deep.equal([new Lexeme('rightParenthesis', ')')])
      expect(lex(')')[0]).to.be.an.instanceof(Lexeme.prototype.constructor)
    })
    it('should return an array with the corresponding lexemes for any string containing one or more constants, variables, operators, parentheses', function () {
      expect(lex('10+x')).to.deep.equal([
        new Lexeme('constant', '10'),
        new Lexeme('operator', '+'),
        new Lexeme('variable', 'x')
      ])

      expect(lex('201*y')).to.deep.equal([
        new Lexeme('constant', '201'),
        new Lexeme('operator', '*'),
        new Lexeme('variable', 'y')
      ])

      expect(lex('1000/k-z')).to.deep.equal([
        new Lexeme('constant', '1000'),
        new Lexeme('operator', '/'),
        new Lexeme('variable', 'k'),
        new Lexeme('operator', '-'),
        new Lexeme('variable', 'z')
      ])

      expect(lex('203(+/10)')).to.deep.equal([
        new Lexeme('constant', '203'),
        new Lexeme('leftParenthesis', '('),
        new Lexeme('operator', '+'),
        new Lexeme('operator', '/'),
        new Lexeme('constant', '10'),
        new Lexeme('rightParenthesis', ')')
      ])
    })
  })
})
