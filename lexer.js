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
						token = new Operator(value);
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

class Variable {
	constructor(letter) {
		this.letter = letter;
	}
}

class Operator {
	constructor(symbol) {
		this.symbol = symbol;
	}
}

console.log(Lexer.analyze("10 A+ x - y* 20"));
console.log(Lexer.analyze("10+ x x- 2001"));
