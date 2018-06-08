const Variable = require('./variable.js');
const RightAssociativeOperator = require('./rightAssociativeOperator.js');
const LeftAssociativeOperator = require('./leftAssociativeOperator.js');
const Operator = require('./operator.js');

class Lexer {
	static analyze(string){
		var associationMap = new Map()
		.set('number', /^[0-9]+/)
		.set('space', /^\s+/)
		.set('variable', /^[a-z]+/)
		.set('operator', /^[\+\-\*]/);

		var analyzedString = [];
		var flag;

		while (string){
		flag = false;
		for (var [kind, regex] of associationMap) {
			if (regex.test(string)) {
				flag = true;
				let value = string.match(regex)[0];
				let token;
				switch (kind) {
					case 'number':
						token = new Number(parseInt(value));
						break;
					case 'variable':
						token = new Variable(value);
						break;
					case 'operator':
						if (LeftAssociativeOperator.check(value)){
							token = new LeftAssociativeOperator(value);
						}
						else token = new RightsAssociativeOperator(value);
						break;
				}
				if (token){
					analyzedString.push(token);
				}
				string = string.split(regex)[1];
			}
		}
		if (!flag) return 0;
		}
		return analyzedString;
	}
}
console.log(Lexer.analyze("10 A+ x - y* 20"));
console.log(Lexer.analyze("10+ x x- 2001"));
