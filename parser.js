const Lexer = require('./lexer.js')
const ASTClasses = require('./ASTClasses/ASTClasses.js')
const ASTVariable = ASTClasses.ASTVariable
const ASTOperator = ASTClasses.ASTOperator
const ASTConstant = ASTClasses.ASTConstant

class Parser {
  static parse (tokenizedArray) {
    var outputStack = []
    var operatorStack = []

    tokenizedArray.forEach(function (token) {
      if (token.type === 'number') {
        let newASTConstant = new ASTConstant(token.value)
        outputStack.push(newASTConstant)
      } else if (token.type === 'operator') {
        let newASTOperator = new ASTOperator(token.value)
        if (operatorStack.length !== 0) {
          let previousOperator = operatorStack[operatorStack.length - 1]

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
        } else {
          operatorStack.push(newASTOperator)
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
    if (node instanceof ASTConstant) {
      return node.value
    } else {
      let right = Parser.convertToString(node.children[1])
      let left = Parser.convertToString(node.children[0])
      return left + node.value + right
    }
  }
}

let test1 = Parser.parse(Lexer.analyze('10+3*4+5/6'))
console.log(test1)
console.log(Parser.convertToString(test1))
