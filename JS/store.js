if (document.readyState == 'loading'){
	document.addEventListener('DOMContentLoaded', ready)
} else{
	ready()
}	//Checks the document has fully loaded before running the ready function

function ready(){
	var removeCartItemButtons = document.getElementsByClassName('btn-danger')
	console.log(removeCartItemButtons)
	for (var i = 0; i < removeCartItemButtons.length; i++){
		var button = removeCartItemButtons[i]
		button.addEventListener('click', removeCartItem)
	}
	
	var quantityInputs = document.getElementsByClassName('cart-quantity-input')
	for (var i = 0; i < quantityInputs.length; i++) {
		var input = quantityInputs[i]
		input.addEventListener('change', quantityChanged)
	}	
	
	var addToCartButtons = document.getElementsByClassName('shop-item-button')
	for (var i = 0; i < addToCartButtons.length; i++){
		var button = addToCartButtons[i]
		button.addEventListener('click', addToCartClicked)
	}	
	
	document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked(){
	alert('Thankyou for your purchase') //On a fully functional site this alert would be changed for a payment page
	var cartItems = document.getElementsByClassName('cart-items')[0]
	while (cartItems.hasChildNodes()){ //While there are items in the cart
		cartItems.removeChild(cartItems.firstChild) //remove each item from the cart
	}	
	updateCartTotal() //Runs the function to change the total back to 0
	localStorage.clear() //Clears the local storage so the cart is not restocked if the page is refreshed or re opened
}	

function removeCartItem(event){
	var buttonClicked = event.target
			buttonClicked.parentElement.parentElement.remove() //Removes the item from the cart
			updateCartTotal() //Updates the total
			localStorage.clear() //Clears the item from local storage so it cant be reloaded in to the cart
}	

function quantityChanged(event) {
	var input = event.target
	if (isNaN(input.value) || input.value <= 0){ //If the user doesn't enter a number or it is less than 0
		input.value = 1 //Then the value is changed to 1 and cant be any lower
	}	
	updateCartTotal() 
}

function addToCartClicked(event) {
	var button = event.target
	var shopItem = button.parentElement.parentElement //Gets the item from the page
	var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText //Gets the item name
	var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText //Gets the items price
	var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src //Gets the image for the item
	addItemToCart(title, price, imageSrc) //Function that puts the item in the cart
	updateCartTotal()
	localStorage.setItem("shoppingCartTitle", JSON.stringify(title)) //Stores each element in the local storage
	localStorage.setItem("shoppingCartPrice", JSON.stringify(price))
	localStorage.setItem("shoppingCartImage", JSON.stringify(imageSrc))
}	

function addItemToCart(title, price, imageSrc){
	var cartRow = document.createElement('div') //Creates a div element for each item that is added to the cart
	cartRow.classList.add('cart-row')
	var cartItems = document.getElementsByClassName('cart-items')[0] //Gets the item
	var cartItemNames = cartItems.getElementsByClassName('cart-item-title') //Gets the items name
	for (var i = 0; i < cartItemNames.length; i++) {
		if (cartItemNames[i].innerText == title){ //Checks if the item is already in the cart if the add to cart button is clicked again
			alert('This item is already added to the cart') //Sends an alert that the item is already in the cart
			return
		}	
	}	
	var cartRowContents = `
		<div class="cart-item cart-column">
			<img class="cart-item-image" src="${imageSrc}" width="100">
			<span class="cart-item-title">${title}</span>
		</div>
		<span class="cart-price cart-column">${price}</span>
		<div class="cart-quantity cart-column">
			<input class="cart-quantity-input" type="number" value="1">
			<button class="btn btn-danger" type="button">REMOVE</button>
		</div>` //Adds the HTML code to the cart every time an item is added to the cart
	cartRow.innerHTML = cartRowContents //Adds the HTML to the div created by cartRow
	cartItems.append(cartRow)
	cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
	cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}	

function updateCartTotal(){
	var cartItemContainer = document.getElementsByClassName('cart-items')[0]
	var cartRows = cartItemContainer.getElementsByClassName('cart-row')
	var total = 0 //sets the default total to 0
	for (var i = 0; i < cartRows.length; i++){ //Loops for how many items are in the cart
		var cartRow = cartRows[i]
		var priceElement = cartRow.getElementsByClassName('cart-price')[0] //Gets the price for the item on that row
		var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0] //Gets the quantity for the item
		var price = parseFloat(priceElement.innerText.replace('£','')) //This removes the £ from the price so it can be multiplied as an integer
		var quantity = quantityElement.value
		total = total + (price * quantity) //Adds the items total to the overall total
	}
	total = Math.round(total * 100) / 100 //This stops the total from displaying more than 2 decimal places for the price
	document.getElementsByClassName('cart-total-price')[0].innerText = '£' + total
}

function loadCart(){ //Function to reload the cart with the local storage
	title = JSON.parse(localStorage.getItem("shoppingCartTitle"))
	price = JSON.parse(localStorage.getItem("shoppingCartPrice"))
	imageSrc = JSON.parse(localStorage.getItem("shoppingCartImage"))
	if (title == null){ //Checks if local storage is empty so that a null item isn't loaded in to the cart
		
	} else{
		addItemToCart(title, price, imageSrc) //Function to add item to cart
	}
	
}

loadCart() //Reloads the cart with the local storage
updateCartTotal()
