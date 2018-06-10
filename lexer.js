const Lexeme = require('./lexeme.js')

class Lexer {
  static analyze (string) {
    var associationMap = new Map()
      .set('constant', /^[0-9]+/)
      .set('space', /^\s+/)
      .set('variable', /^[a-z]+/)
      .set('operator', /^[/+\-*]/)
      .set('leftParenthesis', /^\(/)
      .set('rightParenthesis', /^\)/)

    var analyzedString = []
    var flag

    while (string) {
      flag = false
      for (var [kind, regex] of associationMap) {
        if (regex.test(string)) {
          flag = true
          let value = string.match(regex)[0]
          let token = new Lexeme(kind, value)
          analyzedString.push(token)
          string = string.split(regex)[1]
        }
      }
      if (!flag) return 0
    }
    return analyzedString
  }
}

module.exports = Lexer
