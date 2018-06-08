const Node = require('./node.js');
const LeftAssociativeOperator = require('./leftAssociativeOperator.js');
const RightAssociativeOperator = require('./rightAssociativeOperator.js');
const Variable = require('./variable.js');
const Lexer = require('./lexer.js');

class Parser {
	static parse (tokenizedArray) {
		var outputStack = [];
		var operatorStack = [];
		console.log(tokenizedArray);

		tokenizedArray.forEach( function(token) {
			let newNode = new Node(token);
			if (token instanceof Number) {
				outputStack.push(newNode);
			}
			else if (token instanceof LeftAssociativeOperator) {
				if (operatorStack.length != 0 ) {
					let previousOperator = operatorStack[operatorStack.length-1].context;

					if (previousOperator instanceof LeftAssociativeOperator){
						let child1 = outputStack.pop();
						let child2 = outputStack.pop();
						let replacementNode = operatorStack.pop();
						replacementNode.childs.push(child1);
						replacementNode.childs.push(child2);
						outputStack.push(replacementNode);
						operatorStack.push(newNode);
					}
				}
				else {
					operatorStack.push(newNode);
				}
			}
		});
		while (operatorStack.length != 0 ) {
			let replacementNode = operatorStack.pop();
			console.log(replacementNode.childs);
			let child1 = outputStack.pop();
			let child2 = outputStack.pop();
			replacementNode.childs.push(child1, child2);
			outputStack.push(replacementNode);
		}
		return outputStack.pop();
	}

	static convertToString(node) {
		if (node.context instanceof Number){
			return node.context.toString();
		}
		else {
			let right = Parser.convertToString(node.childs[0]);
			let left = Parser.convertToString(node.childs[1]);
			console.log(node);
			return left + node.context.symbol + right;
		}
	}
}

let test1 = Parser.parse(Lexer.analyze("10+5-8+9-20"));
console.log(test1);
console.log(Parser.convertToString(test1));
