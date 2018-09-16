function focusAndPassKey(event) {
	if (event.key.length > 1 && event.keyCode != 13){
		return;
	}
	document.body.removeEventListener("keyup", focusAndPassKey);
	document.getElementById('password').focus();
	if (event.keyCode == 13){
		return;
	}
	document.getElementById('password').value += event.key;
}
function clearBG(){
	document.body.classList.add("background-clear");
	document.body.classList.remove("background-blur");
	document.body.addEventListener("keyup", focusAndPassKey);
}
function blurBG(){
	document.body.classList.add("background-blur");
	document.body.classList.remove("background-clear");
	document.body.removeEventListener("keyup", focusAndPassKey);
}
function detectEscape(event){
	if (event.keyCode == 27){
		document.getElementById('password').blur();
	}
}
document.body.addEventListener("keyup", focusAndPassKey);
document.body.addEventListener("keyup", detectEscape);
