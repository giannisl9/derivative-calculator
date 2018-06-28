const Lexeme = require('./lexeme.js')
const associationMap = new Map()
  .set('constant', /^[0-9]+/)
  .set('sign', /^mi|^pl/)
  .set('space', /^\s+/)
  .set('variable', /^[a-z]/)
  .set('operator', /^[/+\-*]/)
  .set('leftParenthesis', /^\(/)
  .set('rightParenthesis', /^\)/)

module.exports.lex = function (input) {
  let analyzedString = []
  if (input === '') throw 'empty input'
  while (input) {
    let found = false
    for (var [kind, regex] of associationMap) {
      if (regex.test(input)) {
        found = true
        let value = input.match(regex)[0]
        let token = new Lexeme(kind, value)
        analyzedString.push(token)
        input = input.split(regex)[1]
        break
      }
    }
    if (!found) throw 'invalid input'
  }
  return analyzedString
}
