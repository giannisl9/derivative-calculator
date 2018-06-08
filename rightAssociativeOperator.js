const Operator = require('./operator.js');

class RightAssociativeOperator extends Operator {
	static check(symbol) {
		let rightAssociativeOperatorsSymbols = ['*'];
		if( rightAssociativeOperatorsSymbols.includes(symbol)  ) return true;
		return false;
	}
}
module.exports = RightAssociativeOperator;
