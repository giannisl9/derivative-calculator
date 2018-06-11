const Lexer = require('./lexer.js')
const Parser = require('./parser.js')
const ASTClasses = require('./ASTClasses/ASTClasses.js')
const ASTConstant = ASTClasses.ASTConstant
const ASTVariable = ASTClasses.ASTVariable

module.exports = class Expression {
  constructor (string) {
    this.string = string
    this.analyzeExpression()
  }

  analyzeExpression () {
    this.tokenizedArray = Lexer.analyze(this.string)
  }

  parseExpression () {
    let parser = new Parser()
    let parseOutput = parser.parse(this.tokenizedArray)
    this.AST = parser.parse(this.tokenizedArray)
  }

  nodeToString (node) {
    if (node instanceof ASTConstant || node instanceof ASTVariable) {
      return node.value
    } else {
      let right = this.nodeToString(node.children[1])
      let left = this.nodeToString(node.children[0])
      return '(' + left + node.value + right + ')'
    }
  }

  toString () {
    return this.nodeToString(this.AST)
  }
}
