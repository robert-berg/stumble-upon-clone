export let isStart = true;
let closeFunction = null;
var backButtonHandler;


export function openPage(callback, closeFunc = null) {
	isStart = false;
	closeFunction = closeFunc;
	return callback;
}

export function closePage() {
	if (closeFunction) {
		closeFunction();
	}
	closeFunction = null;
	return setTimeout(function() {
		isStart = true;
	}, 1500);
}
