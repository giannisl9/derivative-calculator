const ASTClasses = require('./AST/ASTClasses.js')
const ASTOperator = ASTClasses.ASTOperator
const ASTConstant = ASTClasses.ASTConstant
const ASTVariable = ASTClasses.ASTVariable

module.exports.parse = function (tokenizedArray) {
  let outputStack = []
  let operatorStack = []

  tokenizedArray.forEach(function (token, index) {
    let parseMessage = 'success'
    switch (token.type) {
      case 'operator':
        let newASTOperator = new ASTOperator(token.value)
        parseMessage = parseOperator(newASTOperator)
        break
      case 'rightParenthesis':
        parseMessage = parseRightParenthesis()
        break
      case 'constant':
        let newASTConstant = new ASTConstant(token.value)
        parseMessage = parseConstant(newASTConstant, index)
        break
      case 'variable':
        let newASTVariable = new ASTVariable(token.value)
        parseMessage = parseVariable(newASTVariable, index)
        break
      case 'leftParenthesis':
        parseMessage = parseLeftParenthesis(token, index)
        break
    }
    if (parseMessage !== 'success') {
      return parseMessage
    }
  })
  while (operatorStack.length !== 0) popFromOperatorStackPushToOutputStack()
  return outputStack.pop()

  function parseLeftParenthesis (token, i) {
    let parseMessage = 'success'
    if (i > 0) {
      if (['variable', 'constant', 'rightParenthesis'].includes(tokenizedArray[i - 1].type)) {
        let newASTOperator = new ASTOperator('*')
        parseMessage = parseOperator(newASTOperator)
      }
    }
    if (parseMessage !== 'success') return 'failed to add missing operator'
    operatorStack.push(token)
    return 'success'
  }

  function parseConstant (ASTConstant, i) {
    outputStack.push(ASTConstant)
    return 'success'
  }

  function parseVariable (ASTVariable, i) {
    outputStack.push(ASTVariable)
    return 'success'
  }
  function checkLastInOperatorStack () {
    if (operatorStack.length === 0) return 'operatorStack empty'
    let lastOperator = operatorStack[operatorStack.length - 1]
    if (lastOperator instanceof ASTOperator) return 'operator'
    return 'leftParenthesis'
  }

  function parseRightParenthesis () {
    let foundLeftParenthesis = false
    let continuieLoop = true
    do {
      switch (this.checkLastInOperatorStack()) {
        case 'operatorStack empty':
          continuieLoop = false
          break
        case 'leftParenthesis':
          continuieLoop = false
          foundLeftParenthesis = true
          operatorStack.pop()
          break
        case 'operator':
          popFromOperatorStackPushToOutputStack()
          break
      }
    } while (continuieLoop)
    if (foundLeftParenthesis === false) {
      return 'did not find left parenthesis'
    }
    return 'success'
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
    switch (checkLastInOperatorStack()) {
      case 'operatorStack empty':
      case 'leftParenthesis':
        operatorStack.push(ASTOperator)
        break
      case 'operator':
        let previousOperator = operatorStack[operatorStack.length - 1]
        if (previousOperator.precedence >= ASTOperator.precedence && ASTOperator.associativity === 'left') {
          popFromOperatorStackPushToOutputStack()
        }
        operatorStack.push(ASTOperator)
        break
    }
    return 'success'
  }
}
