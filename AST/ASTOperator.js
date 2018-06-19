var ASTNode = require('./ASTNode.js')

module.exports = class ASTOperator extends ASTNode {
  constructor (value) {
    super(value)
    this.associativity = ASTOperator.findType(value)
    this.precedence = ASTOperator.findPrecedence(value)
    this.children = []
  }

  static findType (value) {
    if (['+', '-', '*', '/'].includes(value)) return 'left'
    else return 'right'
  }

  static findPrecedence (value) {
    if (['+', '-'].includes(value)) return 1
    else return 2
  }
}
