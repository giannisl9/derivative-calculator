var ASTNode = require('./ASTNode.js');

module.exports = class ASTVariable extends ASTNode {
	constructor (value) {
		super(value);
	}
}
