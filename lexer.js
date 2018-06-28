const Lexeme = require('./lexeme.js')
const associationMap = new Map()
  .set('constant', /^[0-9]+/)
  .set('space', /^\s+/)
  .set('variable', /^[a-z]+/)
  .set('operator', /^[/+\-*]/)
  .set('leftParenthesis', /^\(/)
  .set('rightParenthesis', /^\)/)

const negAssociationMap = new Map()
  .set('constant', /^\-?[0-9]+/)
  .set('space', /^\s+/)
  .set('variable', /^[a-z]+/)
  .set('operator', /^[/+\-*]/)
  .set('leftParenthesis', /^\(/)
  .set('rightParenthesis', /^\)/)

module.exports.lex = function (input) {
  let analyzedString = []
  if (input === '') throw 'empty input'
  let lastOperator = true; // 
  while (input) {
    let found = false
    for (var [kind, regex] of (lastOperator ? negAssociationMap : associationMap) ) { // 
      if (regex.test(input)) {
        found = true
        let value = input.match(regex)[0]
        let token = new Lexeme(kind, value)
        analyzedString.push(token)
        input = input.split(regex)[1]
        lastOperator = kind === 'operator' // 
        break
      }
    }
    if (!found) throw 'invalid input'
  }
  return analyzedString
}
