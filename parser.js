const Lexer = require('./lexer.js');
const ASTClasses = require('./ASTClasses/ASTClasses.js');
const ASTVariable = ASTClasses.ASTVariable;
const ASTOperator = ASTClasses.ASTOperator;
const ASTConstant = ASTClasses.ASTConstant;

class Parser {
	static parse (tokenizedArray) {
		var outputStack = [];
		var operatorStack = [];

		tokenizedArray.forEach( function(token) {
			if (token.type === 'number') {
				let newASTConstant = new ASTConstant(token.value);
				outputStack.push(newASTConstant);
			}
			else if (token.type === 'operator') {
				if (operatorStack.length != 0 ) {
					let previousOperator = operatorStack[operatorStack.length-1];

					if (previousOperator.associativity = 'left'){
						let child1 = outputStack.pop();
						let child2 = outputStack.pop();
						let replacementNode = operatorStack.pop();
						replacementNode.children.push(child2, child1);
						outputStack.push(replacementNode);
						operatorStack.push(new ASTOperator(token.value));
					}
				}
				else {
					operatorStack.push(new ASTOperator(token.value));
				}
			}
		});
		while (operatorStack.length != 0 ) {
			let replacementNode = operatorStack.pop();
			let child1 = outputStack.pop();
			let child2 = outputStack.pop();
			replacementNode.children.push(child2, child1);
			outputStack.push(replacementNode);
		}
		return outputStack.pop();
	}

	static convertToString(node) {
		if (node instanceof ASTConstant){
			return ASTConstant.toString();
		}
		else {
			let right = Parser.convertToString(node.children[0]);
			let left = Parser.convertToString(node.children[1]);
			return left + node.context.symbol + right;
		}
	}
}

let test1 = Parser.parse(Lexer.analyze("10+5-8"));
console.log(test1);
