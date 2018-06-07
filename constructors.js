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
				let newObject;
				switch (kind) {
					case 'number':
						newObject = new Number(parseInt(value));
						break;
					case 'variable':
						newObject = new Variable(value);
						break;
					case 'operator':
						newObject = new Operator(value);
						break;
				}
				if (newObject){
					analyzedString.push(newObject);
				}
				string = string.split(regex)[1];
			}
		}
		if (!flag) {break;return 0;}
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
