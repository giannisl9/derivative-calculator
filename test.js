const Expression = require('./expression.js')

var test1 = new Expression('10+2')
console.log(test1.AST)
console.log(test1.toString())
