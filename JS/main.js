if (document.readyState == 'loading'){
	document.addEventListener('DOMContentLoaded', ready)
} else{
	ready()
}	

function ready(){	
	document.getElementsByClassName('login-button')[0].addEventListener('click', loginClicked)
}

function loginClicked(){
	alert('Were signing you in...')
}	