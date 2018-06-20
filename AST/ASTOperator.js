var ASTNode = require('./ASTNode.js')

module.exports = class ASTOperator extends ASTNode {
  constructor (value, child1, child2) {
    super(value)
    this.associativity = ASTOperator.findType(value)
    this.precedence = ASTOperator.findPrecedence(value)
    if (child1 instanceof ASTNode && child2 instanceof ASTNode) this.children = [child1, child2]
    else this.children = []
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
