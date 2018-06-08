const Operator = require('./operator.js');

class LeftAssociativeOperator extends Operator {
	static check(symbol) {
		let leftAssociativeOperatorsSymbols = ['+', '-'];
		if( leftAssociativeOperatorsSymbols.includes(symbol)  ) return true;
		return false;
	}
}
module.exports = LeftAssociativeOperator;
