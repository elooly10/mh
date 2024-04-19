export const explicitSymbolsForEmail = [
	'*',
	'/',
	'!',
	'$',
	'[',
	']',
	'{',
	'}',
	'\\',
	'\n',
	'\r',
	'\t',
	'\b',
	'\f'
];
export function isIssue(string: string, symbols = explicitSymbolsForEmail) {
	let a = false;
	symbols.forEach((sym) => {
		a ||= string.includes(sym);
	});
	return a;
}
