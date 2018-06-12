const chai = require('chai')
const assert = chai.assert
const Lexer = require('../lexer.js')
const Lexeme = require('../lexeme.js')

describe('Lexer', function () {
  describe('#analyze()', function () {
    describe('for not valid strings', function () {
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
    })
    describe('for strings with a single tokens', function () {
      it('should return an array with a lexeme{ type: constant, value: x } for any number x', function () {
        let tests = ['1', '10', '21', '100']
        tests.forEach(function (test) {
          let expected = [new Lexeme('constant', test)]
          let result = Lexer.analyze(test)
          assert.deepEqual(expected, result)
          assert.instanceOf(result[0], Lexeme.prototype.constructor)
        })
      })
      it('should return an array with a lexeme{ type: variable, value: x } for any variable x', function () {
        let tests = ['x', 'k', 'l', 'm']
        tests.forEach(function (test) {
          let expected = [new Lexeme('variable', test)]
          let result = Lexer.analyze(test)
          assert.deepEqual(expected, result)
          assert.instanceOf(result[0], Lexeme.prototype.constructor)
        })
      })
      it('should return an array with a lexeme{ type: operator, value: x } for any operator x:[+,-,*,/]', function () {
        let tests = ['+', '-', '*', '/']
        tests.forEach(function (test) {
          let expected = [new Lexeme('operator', test)]
          let result = Lexer.analyze(test)
          assert.deepEqual(expected, result)
          assert.instanceOf(result[0], Lexeme.prototype.constructor)
        })
      })
    })
  })
})
