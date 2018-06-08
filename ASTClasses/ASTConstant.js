var ASTNode = require('./ASTNode.js');

module.exports = class ASTConstant extends ASTNode {
	constructor (value) {
		super(value);
	}
}
