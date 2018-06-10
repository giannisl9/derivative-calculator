const ASTClasses = require('./ASTClasses/ASTClasses.js')
const ASTOperator = ASTClasses.ASTOperator
const ASTConstant = ASTClasses.ASTConstant
const ASTVariable = ASTClasses.ASTVariable

module.exports = class Parser {
  static parse (tokenizedArray) {
    var outputStack = []
    var operatorStack = []
    tokenizedArray.forEach(function (token, index) {
      if (token.type === 'number') {
        let newASTConstant = new ASTConstant(token.value)
        outputStack.push(newASTConstant)
      } else if (token.type === 'variable') {
        let newASTVariable = new ASTVariable(token.value)
        outputStack.push(newASTVariable)
      } else if (token.type === 'operator') {
        let newASTOperator = new ASTOperator(token.value)
        if (operatorStack.length !== 0) {
          let previousOperator = operatorStack[operatorStack.length - 1]
          if (previousOperator instanceof ASTOperator) {
            if (newASTOperator.precedence <= previousOperator.precedence && previousOperator.associativity === 'left') {
              let child1 = outputStack.pop()
              let child2 = outputStack.pop()
              let replacementNode = operatorStack.pop()
              replacementNode.children.push(child2, child1)
              outputStack.push(replacementNode)
              operatorStack.push(newASTOperator)
            } else {
              operatorStack.push(newASTOperator)
            }
          } else { // previousOperator is token with token.value 'leftparenthesis'
            operatorStack.push(newASTOperator)
          }
        } else {
          operatorStack.push(newASTOperator)
        }
      } else if (token.type === 'leftParenthesis') {
        operatorStack.push(token)
      } else if (token.type === 'rightParenthesis') {
        let replacementNode = operatorStack.pop()
        while (replacementNode instanceof ASTOperator) {
          let child1 = outputStack.pop()
          let child2 = outputStack.pop()
          replacementNode.children.push(child2, child1)
          outputStack.push(replacementNode)
          replacementNode = operatorStack.pop()
        }
      }
    })
    while (operatorStack.length !== 0) {
      let replacementNode = operatorStack.pop()
      let child1 = outputStack.pop()
      let child2 = outputStack.pop()
      replacementNode.children.push(child2, child1)
      outputStack.push(replacementNode)
    }
    return outputStack.pop()
  }

  static convertToString (node) {
    if (node instanceof ASTConstant || node instanceof ASTVariable) {
      return node.value
    } else {
      let right = Parser.convertToString(node.children[1])
      let left = Parser.convertToString(node.children[0])
      return '(' + left + node.value + right + ')'
    }
  }
}
