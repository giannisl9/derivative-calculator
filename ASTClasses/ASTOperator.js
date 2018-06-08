var ASTNode = require('./ASTNode.js');

module.exports = class ASTOperator extends ASTNode {
	constructor (value) {
		super(value);
		this.associativity = ASTOperator.findType(value);
	}

	static findType (value) {
		if (['+','-'].includes(value)) return 'left';
		else return right;
	}
}
