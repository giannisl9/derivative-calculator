const chai = require('chai')
const assert = chai.assert
const Lexer = require('../lexer.js')
const Lexeme = require('../lexeme.js')

describe('Lexer', function () {
  describe('#analyze()', function () {
    it('should return 0 given an empty string', function () {
      let result = Lexer.analyze('')
      assert.equal(result, 0)
    })
    it('should return 0 given a string including any symbol despite [+,-,*,/]', function () {
      let tests = ['%', '$', '10%1', '10#2+3', '10+2!3']
      tests.forEach(function (test) {
        let result = Lexer.analyze(test)
        assert.equal(result, 0)
      })
    })
    it('should return an array with a lexeme{ type: constant, value: x } for any number x', function () {
      let tests = ['1', '10', '21', '100']
      tests.forEach(function (test) {
        let expected = [new Lexeme('constant', test)]
        let result = Lexer.analyze(test)
        assert.deepEqual(result, expected)
        assert.instanceOf(result[0], Lexeme.prototype.constructor)
      })
    })
    it('should return an array with a lexeme{ type: variable, value: x } for any variable x', function () {
      let tests = ['x', 'k', 'l', 'm']
      tests.forEach(function (test) {
        let expected = [new Lexeme('variable', test)]
        let result = Lexer.analyze(test)
        assert.deepEqual(result, expected)
        assert.instanceOf(result[0], Lexeme.prototype.constructor)
      })
    })
    it('should return an array with a lexeme{ type: operator, value: x } for any operator x:[+,-,*,/]', function () {
      let tests = ['+', '-', '*', '/']
      tests.forEach(function (test) {
        let expected = [new Lexeme('operator', test)]
        let result = Lexer.analyze(test)
        assert.deepEqual(result, expected)
        assert.instanceOf(result[0], Lexeme.prototype.constructor)
      })
    })
    it('should return an array with a lexeme{ type: leftParenthesis, value: ( } for left parenthesis', function () {
      let expected = [new Lexeme('leftParenthesis', '(')]
      let result = Lexer.analyze('(')
      assert.deepEqual(result, expected)
    })
     it('should return an array with a lexeme{ type: rightParenthesis, value: ) } for right parenthesis', function () {
      let expected = [new Lexeme('rightParenthesis', ')')]
      let result = Lexer.analyze(')')
      assert.deepEqual(result, expected)
    })
   it('should return an array with the corresponding lexemes for any string containing one or more constants, variables, operators, parentheses', function () {
      let result = [Lexer.analyze('10+x'), Lexer.analyze('20*y'), Lexer.analyze('100/k+z'), Lexer.analyze('(200)+)')]
      let expected = [
        [new Lexeme('constant', '10'), new Lexeme('operator', '+'), new Lexeme('variable', 'x')],
        [new Lexeme('constant', '20'), new Lexeme('operator', '*'), new Lexeme('variable', 'y')],
        [new Lexeme('constant', '100'), new Lexeme('operator', '/'), new Lexeme('variable', 'k'), new Lexeme('operator', '+'), new Lexeme('variable', 'z')],
        [new Lexeme('leftParenthesis', '('), new Lexeme('constant', '200'), new Lexeme('rightParenthesis', ')'), new Lexeme('operator', '+'), new Lexeme('rightParenthesis', ')')]
      ]
      result.forEach(function (currentResult, index) {
        let currentExpected = expected[index]
        assert.deepEqual(currentResult, currentExpected)
      })
    })
  })
})
