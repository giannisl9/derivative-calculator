const Lexeme = require('./lexeme.js')

class Lexer {
  static analyze (string) {
    var associationMap = new Map()
      .set('number', /^[0-9]+/)
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
          if (['leftParenthesis'].includes(token.type)) {
            if (analyzedString[analyzedString.length - 1].type !== 'operator') {
              let tmp = new Lexeme('operator', '*')
              analyzedString.push(tmp)
            }
          }
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
