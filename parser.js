const ASTClasses = require('./AST/ASTClasses.js')
const ASTOperator = ASTClasses.ASTOperator
const ASTConstant = ASTClasses.ASTConstant
const ASTVariable = ASTClasses.ASTVariable

module.exports.parse = function parse (tokenizedArray) {
  let outputStack = []
  let operatorStack = []
  let inParenthesisStack = []
  let inParenthesis = false
  let parenthesisStartIndex = -1
  let countLeftParenthesis = 0

  tokenizedArray.forEach(function (token, index) {
    if (!inParenthesis) {
      switch (token.type) {
        case 'operator':
          let newASTOperator = new ASTOperator(token.value)
          parseOperator(newASTOperator)
          break
        case 'constant':
          outputStack.push(new ASTConstant(token.value))
          break
        case 'variable':
          outputStack.push(new ASTVariable(token.value))
          break
        case 'leftParenthesis':
          inParenthesis = true
          parenthesisStartIndex = index
          countLeftParenthesis = 1
          break
      }
    } else parseTokenInParenthesis(token, index)
  })
  while (operatorStack.length !== 0) popFromOperatorStackPushToOutputStack()
  return outputStack.pop()

  function parseTokenInParenthesis (token, index) {
    switch (token.type) {
      case 'leftParenthesis':
        countLeftParenthesis += 1
        break
      case 'rightParenthesis':
        if (countLeftParenthesis === 1) {
          let tmp = parse(tokenizedArray.slice(parenthesisStartIndex + 1, index))
          outputStack.push(tmp)
          inParenthesis = false
          inParenthesisStack = []
        } else countLeftParenthesis -= 1
        break
      default:
        inParenthesisStack.push(token)
    }
  }

  function popFromOperatorStackPushToOutputStack () {
    let child1 = outputStack.pop()
    let child2 = outputStack.pop()
    if (child1 === undefined || child2 === undefined) throw 'failed to parse operator'
    let replacementNode = operatorStack.pop()
    replacementNode.children.push(child2, child1)
    outputStack.push(replacementNode)
  }

  function parseOperator (ASTOperator) {
    if (operatorStack.length === 0) {
      operatorStack.push(ASTOperator)
    } else {
      let previousOperator = operatorStack[operatorStack.length - 1]
      if (previousOperator.precedence >= ASTOperator.precedence && ASTOperator.associativity === 'left') {
        popFromOperatorStackPushToOutputStack()
      }
      operatorStack.push(ASTOperator)
    }
  }
}
