//var cardIndex; // the index of a card selected in deck

var userHandUI = $('#userHandUI');
var compHandUI = $('#compHandUI');
var userMatchesUI = $('#userMatchesUI');
var compMatchesUI = $('#compMatchesUI');

var userHandArray = [];
var compHandArray = [];
var userMatchesArray=[];
var compMatchesArray = [];

var newCard;
var setNumber;
var deck = [];

// BUILD DECK AUTOMATICALLY
var buildDeck = function() {
	var numberOption =["ace","two","three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"];
	var suitOption = ["spades", "clubs", "diamonds", "hearts"];

	for (i = 0; i < numberOption.length; i++) {
		for(var j = 0; j < suitOption.length; j++)  {
		    deck.push(
		    	{"cardNumber": numberOption[i], "cardSuit": suitOption[j], "cardId": suitOption[j] + numberOption[i]}
		    );
		}
	}
}

// SET CARD LANGUAGE (case/switch function)


// SELECT RANDOM CARD FROM DECK

	var drawFromDeck = function() {
		var cardIndex = Math.floor((Math.random() * deck.length - 1) + 1);
		console.log('card index: ' + cardIndex);
		newCard = deck[cardIndex];
		deck.splice(cardIndex, 1);
		return newCard;
	}


//CREATE UI CARD

	var createCard = function(cardObject, player) {
		if (player === 'user') {
			console.log('<div class="card card_in_user_hand ' + cardObject.cardId + ' ' + cardObject.cardNumber + '" id="' + cardObject.cardId + '" data-number="' + cardObject.cardNumber + '"></div>');
			return '<div class="card card_in_user_hand ' + cardObject.cardId + ' ' + cardObject.cardNumber + '" id="' + cardObject.cardId + '" data-number="' + cardObject.cardNumber + '"></div>';
		}
		else if (player === 'comp') {
			console.log('<div class="card card_in_comp_hand ' + cardObject.cardId + ' ' + cardObject.cardNumber + '" id="' + cardObject.cardId + '" data-number="' + cardObject.cardNumber + '"></div>');
			return '<div class="card card_in_comp_hand ' + cardObject.cardId + ' ' + cardObject.cardNumber + '" id="' + cardObject.cardId + '" data-number="' + cardObject.cardNumber + '"></div>';			
		}
	}


// ADD TO HAND

	var addToHand = function(array, hand, cardDiv, cardObject) {
		console.log('move to hand firing');
		array.push(cardObject);
		hand.append(cardDiv);	
	} 


// DEAL 

var deal = function(){
	while (userHandArray.length < 25) {
		addToHand(compHandArray, compHandUI, createCard(drawFromDeck(), 'comp'), newCard);
		addToHand(userHandArray, userHandUI, createCard(drawFromDeck(), 'user'), newCard);
	}
}

// CHECK FOR MATCHES IN OPPONENT HAND (and prep for retrieval)

var checkForMatch = function (card, playerHandArray, opponentHandArray) {
	var matches = 0;
	for (var i = 0; i < opponentHandArray.length; i++) {
		if (opponentHandArray[i].cardNumber == card) {
			//var uiClass = opponentHandArray[i].cardId;
			$('.' + card).addClass('gotcha');
			playerHandArray.push(opponentHandArray[i]);
			opponentHandArray.splice(opponentHandArray[i], 1);
			matches += 1;
		}
	}
	return matches;
}


// MATCH MESSAGING (right now would need to be called w/ checkForMatch)

var matchMessaging = function(matches) {
	if (matches == 0) {
		console.log('no matches, sorry');
	}
	else if (matches == 1) {
		console.log('you found one!');
	}
	else if (matches > 1 && matches < 4) {
		console.log('you found some!');
	}
	else {
		console.log('error');
	}
}


// RETRIEVE MATCHES FROM OPPONENT IN UI

var retrieveMatches = function(playerHandUI) {
	var matchesWon = $('.gotcha');
	console.log('matches one: ' + matchesWon);
	playerHandUI.append(matchesWon);
	matchesWon.removeClass('gotcha');
}


// CHECK FOR SET 

var checkForSet = function(player) {
	var hand;

	if (player === 'user') {
		hand = userHandArray;
	}
	else if (player === 'comp') {
		hand = compHandArray;
	}

	console.log('player: ' + player);

	for (var i = 0; i < (hand.length - 3); i++) {
		var setCount = 0;
		//var thisCardId = hand[i].cardId;
		for (var j = 0; j < hand.length; j++) {
			if (i != j) {
				if (hand[i].cardNumber == hand[j].cardNumber) {
					setCount += 1;
				}
			}	
		}
		console.log('setcount: ' + setCount);
		if (setCount === 3) {
			setNumber = hand[i].cardNumber;
			console.log('check for match: found set of ' + setNumber + ' in ' + player + ' hand');
			foundSet(setNumber, player);
			return
		}
	}
}

// FOUND SET

var foundSet = function(setNumber, player) {
	// convert set number function 
	// var card = convert(setNumber);
	if (player === 'user') {
		$('.' + setNumber).addClass('new_set_user');
		$('#messageBox').text("found set: You found every " + setNumber + "!");
		$('#file_matches_button').show();
		
		$('#file_matches_button').click(function() {
			$('#file_matches_button').hide();
			moveToSetPile('user', setNumber);
		});
	}
	else if (player === 'comp') {
		$('.' + setNumber).addClass('new_set_comp');
		$('#messageBox').text("found set: Bummer, the computer made a set of " + setNumber);		
	}
	else {
		console.log('error - player not comp or user');
	}
}



// MOVE SET TO MATCH PILE

//Update User Array
var moveToSetPile = function(player, setNumber) {
	console.log('moving to set pile. set number: ' + setNumber);
	if (player == 'user') {
		userHandArray.forEach(function(card){
			if (card.cardNumber === setNumber) {
				userMatchesArray.push(card);
				userHandArray.splice(card, 1);
			}			
		});

		console.log('user matches array length: ' + userMatchesArray.length);
		console.log('user hand array length: ' + userHandArray.length);

		// Update UI
		userMatchesUI.append($('.' + setNumber));
		//$('.user_new_set').removeClass('user_new_set');
	}
	//Update Comp Array
	else if (player == 'comp') {
		compHandArray.forEach(function(card){
			if (card.cardNumber === setNumber) {
				compMatchesArray.push(card);
				compHandArray.splice(card, 1);
			}			
		});

		console.log('user matches array length: ' + userMatchesArray.length);
		console.log('user hand array length: ' + userHandArray.length);

		// UPDATE UI
		compMatchesUI.append($('.' + setNumber));
		//$('.comp_new_set').removeClass('comp_new_set');
	}
	else {
		console.log('error in moving to pile - player not user or comp');
	}
}


// SELECT CARD


// USER TURN

	// USER SELECTS CARD FROM THEIR HAND TO ASK ABOUT

	$(document).on('click', '.card_in_user_hand', function (){
		console.log('clicked card firing');
		$('#ask_button').show();

		var cardRefUI = $(this).attr('id');
		var cardRefNum = $(this).attr('data-number');
		console.log('card ref ui: ' + cardRefUI + 'card ref num: ' + cardRefNum);

		// deselects card if same card is clicked

		if ($(this).hasClass("selected_card")) {
			console.log('same card');
			$(this).removeClass("selected_card");
			$('#ask_button').hide();
		}

		// ensures that only one card selected at a time (switches cards)

		else if ($('#userHandUI .selected_card').length > 0) {
			$('.card').removeClass('selected_card');
			$(this).addClass('selected_card');	
		}

		else {
			$(this).addClass('selected_card');
		}
		
	});





// MESSAGING



//START GAME

buildDeck();
deal();
console.log('done with deal');
checkForSet('user');
//checkForSet('comp');




