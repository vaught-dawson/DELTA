function combineElementsByCharacter(args, outlineCharacter) {
	var newArray = [];
	var newElement;
	var combineElements = false;
	args.forEach((arg) => {
		if (arg.startsWith(outlineCharacter) && arg.endsWith(outlineCharacter)) {
			newArray.push(arg.substring(1, arg.length - 1));
		} else if (arg.startsWith(outlineCharacter)) {
			combineElements = true;
			newElement = arg.substring(1) + ' ';
		} else if (arg.endsWith(outlineCharacter)) {
			combineElements = false;
			newElement += arg.substring(0, arg.length - 1);
			newArray.push(newElement);
		} else if (combineElements) newElement += arg + ' ';
		else newArray.push(arg);
	});
	return newArray;
}

module.exports.combineElementsByCharacter = combineElementsByCharacter;
