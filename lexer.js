const Lexeme = require('./lexeme.js')

class Lexer {
  static analyze (string) {
    var associationMap = new Map()
      .set('number', /^[0-9]+/)
      .set('space', /^\s+/)
      .set('variable', /^[a-z]+/)
      .set('operator', /^[+\-*]/)

    var analyzedString = []
    var flag

    while (string) {
      flag = false
      for (var [kind, regex] of associationMap) {
        if (regex.test(string)) {
          flag = true
          let value = string.match(regex)[0]
          let token
          if (['number', 'variable', 'operator'].includes(kind)) {
            token = new Lexeme(kind, value)
          }
          if (token) analyzedString.push(token)
          string = string.split(regex)[1]
        }
      }
      if (!flag) return 0
    }
    return analyzedString
  }
}

module.exports = Lexer
