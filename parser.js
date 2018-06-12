const ASTClasses = require('./AST/ASTClasses.js')
const ASTOperator = ASTClasses.ASTOperator
const ASTConstant = ASTClasses.ASTConstant
const ASTVariable = ASTClasses.ASTVariable

module.exports = class Parser {
  constructor () {
    this.outputStack = []
    this.operatorStack = []
  }

  parse (tokenizedArray) {
    this.tokenizedArray = tokenizedArray
    if (this.checkTokens() === false) return 'invalid token'
    for (var i = 0; i < this.tokenizedArray.length; i++) {
      let token = this.tokenizedArray[i]
      let parseMessage = 'success'
      switch (token.type) {
        case 'operator':
          let newASTOperator = new ASTOperator(token.value)
          parseMessage = this.parseOperator(newASTOperator)
          break
        case 'rightParenthesis':
          parseMessage = this.parseRightParenthesis()
          break
        case 'constant':
          let newASTConstant = new ASTConstant(token.value)
          parseMessage = this.parseConstant(newASTConstant, i)
          break
        case 'variable':
          let newASTVariable = new ASTVariable(token.value)
          parseMessage = this.parseVariable(newASTVariable, i)
          break
        case 'leftParenthesis':
          parseMessage = this.parseLeftParenthesis(token, i)
          break
      }
      if (parseMessage !== 'success') {
        return parseMessage
      }
    }
    while (this.operatorStack.length !== 0) this.popFromOperatorStackPushToOutputStack()
    return this.outputStack.pop()
  }

  parseLeftParenthesis (token, i) {
    let parseMessage = 'success'
    if (i > 0) {
      if (['variable', 'constant', 'rightParenthesis'].includes(this.tokenizedArray[i - 1].type)) {
        let newASTOperator = new ASTOperator('*')
        parseMessage = this.parseOperator(newASTOperator)
      }
    }
    if (parseMessage !== 'success') return 'failed to add missing operator'
    this.operatorStack.push(token)
    return 'success'
  }

  parseConstant (ASTConstant, i) {
    this.outputStack.push(ASTConstant)
    return 'success'
  }

  parseVariable (ASTVariable, i) {
    this.outputStack.push(ASTVariable)
    return 'success'
  }

  checkLastInOperatorStack () {
    if (this.operatorStack.length === 0) return 'operatorStack empty'
    let lastOperator = this.operatorStack[this.operatorStack.length - 1]
    if (lastOperator instanceof ASTOperator) return 'operator'
    return 'leftParenthesis'
  }

  parseRightParenthesis () {
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
          this.operatorStack.pop()
          break
        case 'operator':
          this.popFromOperatorStackPushToOutputStack()
          break
      }
    } while (continuieLoop)
    if (foundLeftParenthesis === false) {
      return 'did not find left parenthesis'
    }
    return 'success'
  }

  popFromOperatorStackPushToOutputStack () {
    let child1 = this.outputStack.pop()
    let child2 = this.outputStack.pop()
    let replacementNode = this.operatorStack.pop()
    replacementNode.children.push(child2, child1)
    this.outputStack.push(replacementNode)
  }

  parseOperator (ASTOperator) {
    switch (this.checkLastInOperatorStack()) {
      case 'operatorStack empty':
      case 'leftParenthesis':
        this.operatorStack.push(ASTOperator)
        break
      case 'operator':
        let previousOperator = this.operatorStack[this.operatorStack.length - 1]
        if (previousOperator.precedence >= ASTOperator.precedence && ASTOperator.associativity === 'left') {
          this.popFromOperatorStackPushToOutputStack()
        }
        this.operatorStack.push(ASTOperator)
        break
    }
    return 'success'
  }

  checkTokens () {
    this.tokenizedArray.forEach(function (token) {
      if (!['operator', 'constant', 'variable', 'leftParenthesis', 'rightParenthesis'].includes(token)) return false
    })
    return true
  }
}
