//var cardIndex; // the index of a card selected in deck

var userHandUI = $('#userHandUI');
var compHandUI = $('#compHandUI');
var userMatchesUI = $('#userMatchesUI');
var compMatchesUI = $('#compMatchesUI');

var msg = $('#messageBox');

var userHandArray = [];
var compHandArray = [];
var userMatchesArray=[];
var compMatchesArray = [];

var newCard;
var setNumber;
var deck = [];

var userTurn = true;


// BUILD DECK AUTOMATICALLY
var buildDeck = function(callback) {
	var numberOption =["ace","two","three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"];
	var suitOption = ["spades", "clubs", "diamonds", "hearts"];

	for (i = 0; i < numberOption.length; i++) {
		for(var j = 0; j < suitOption.length; j++)  {
		    deck.push(
		    	{"cardNumber": numberOption[i], "cardSuit": suitOption[j], "cardId": suitOption[j] + numberOption[i]}
		    );
		}
	}
	callback();
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

var dealUser = function(){
		setTimeout(function(){
			addToHand(userHandArray, userHandUI, createCard(drawFromDeck(), 'user'), newCard)}, 250);
}

var dealComp = function(callback){
			addToHand(compHandArray, compHandUI, createCard(drawFromDeck(), 'comp'), newCard);
			callback();
}


var checkForMatch = function (card, player) {
	if (player === 'user') {
		var playerArr = userHandArray;
		var opponentArr = compHandArray;
		var opponentClass = 'card_in_comp_hand';
		console.log('here: opparr: ', opponentArr);
	}
	else if (player === 'comp') {
		var playerArr = compHandArray;
		var opponentArr = userHandArray;
		var opponentClass = 'card_in_user_hand';
	}
	var matches = 0;
	opponentArr.forEach(function(oppCard) {
		if (oppCard.cardNumber === card) {
			$('.' + card + '.' + opponentClass).addClass('gotcha');
			playerArr.push(oppCard);
			opponentArr.splice(oppCard, 1);
			console.log('player hand array: ', playerArr.length);
			console.log('opp hand array after handover :', opponentArr.length);
			matches += 1;
		}
	});
	return matches;
}


// 	for (var i = 0; i < opponentArr.length; i++) {
// 		if (opponentArr[i].cardNumber === card) {
// 			//var uiClass = opponentHandArray[i].cardId;
// 			$('.' + card + '.' + opponentClass).addClass('gotcha');
// 			playerArr.push(opponentArr[i]);
// 			opponentArr.splice(opponentArr[i], 1);
// 			matches += 1;
// 		}
// 	}
// 	return matches;
// }






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
	matchesWon.addClass('matched');
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

	for (var i = 0; i < (hand.length - 1); i++) {
		var setCount = 0;
		//var thisCardId = hand[i].cardId;
		for (var j = 0; j < hand.length; j++) {
			if ((i != j) && (hand[i].cardNumber === hand[j].cardNumber)) {
				if (setCount < 2) {
					setCount += 1;
				}
				else if (setCount === 2) {
					var setNumber = hand[i].cardNumber;
					return [true, setNumber, player];
				}
				else {
					console.log('error: set count = ' + setCount);
				}
			} // end of if
		} // end of for j	
	} // end of for i
	console.log('setcount: ' + setCount);
	return [false, null, player];


	// var results = function() {
	// 	var found;

	// 	if (setCount === 3) {
	// 		found = true;
	// 		setNumber = hand[i].cardNumber;
	// 		console.log('check for match: found set of ' + setNumber + ' in ' + player + ' hand');
	// 		return [found, setNumber, player];
	// 	}
	// 	else {
	// 		found = false;
	// 		return [found, setNumber, player];
	// 	}
	// }
}

// FOUND SET

var foundSet = function(setNumber, player) {
	// convert set number function 
	// var card = convert(setNumber);
	if (player === 'user') {
		$('.' + setNumber).addClass('new_set_user');
		$('#file_set_button').show();
		if (deck.length === 2) {
			msg.text("You were dealt a set of " + setNumber + "!");
		}
		else {
			msg.text("You made a set of " + setNumber + "!");
		}

	}
	else if (player === 'comp') {
		$('.' + setNumber).addClass('new_set_comp');
		if (deck.length === 2) { //if this is after deal, before play starts
			msg.text("Bummer - looks like the computer was dealt a set of " + setNumber);
			setTimeout(function(){
				moveToSetPile('comp', setNumber);
				msg.text("Let's get started! You go first - select a card in your hand to ask computer for.");
				userTurn = true;
			}, 2000);
		}
		else {
		msg.text("found set: Bummer, the computer made a set of " + setNumber);
		}		
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
if (userTurn === true) {
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
}

// ASK BUTTON

$('#ask_button').click(function() {
	msg.text("");
	$('#ask_button').hide();
	var selectedCard = $('.selected_card').attr('data-number');
		console.log('ask button fired, asking for: ' + selectedCard);
	setTimeout(function() {
		var matches = checkForMatch(selectedCard, 'user');
		if (matches > 0) {
			msg.text("You found matching cards!");
			setTimeout(function() {
				retrieveMatches(userHandUI);
				var set = checkForSet('user')[0];
				if (set === true) {
					var setNumber = checkForSet('user')[1];
					foundSet(setNumber, 'user');
				}
				msg.text("Go again!");
			}, 1000);
		}
	}, 1000);
});

// FILE SET BUTTON

	$('#file_set_button').click(function() {
		$('#file_set_button').hide();
		setNumber = $('.new_set_user').attr('data-number');
		moveToSetPile('user', setNumber);
		if (deck.length < 2) {
			msg.text('Go again!');
		}
		else {
			msg.text('You go first!');
		}
	});

// MESSAGING




// USER TURN
// beginning
var startGameOLD = function() {
	if (checkForSet('user')[0] === true) {
		console.log('you found a set');
		// highlight cards and show that user found a set
		return checkForSet('user');
	}
	else {
		console.log("you didn't find a set");
	}
	if (checkForSet('comp')[0] === true) {
		console.log('computer found a set');
		// highlight cards and show that user found a set
		
	}
	else {
		console.log("comp didn't find a set");
	}
}


// GAME FLOW: DEAL CARDS
var startGame = function(callback) {
	buildDeck(function() {
  	var alternate = setInterval(deal, 500);
  	function deal() {
  		if (userHandArray.length === 25) {
	  		clearInterval(alternate);
	  		console.log('done with deal ' + deck.length);
	  		callback();
	  	}
	  	else {
	  		dealComp(dealUser);
	  	}
	  }
	});
}


// GAME FLOW: CHECK FOR DEALT SETS

startGame(function(){
	console.log('done! checking for set');
	var userArr = checkForSet('user');
	var compArr = checkForSet('comp');
	if (compArr[0] === true) {
		console.log('comp drew a set');
		msg.text('Looks like the computer was dealt a set :P');
		var setNumber = compArr[1];
		foundSet(setNumber, 'comp');

		if (userArr[0] === true) {
			setTimeout(function(){
				console.log('you drew a set');
				msg.text('No worries! You drew a set too!');
				var setNumber = userArr[1];
				foundSet(setNumber, 'user');
			}, 1000);
		}
	}
	else if (userArr[0] === true) {
		console.log('you found a set');
		msg.text('What luck! You drew a set!');
		var setNumber = userArr[1];
		foundSet(setNumber, 'user');
	}
	else {
		console.log('no sets dealt');
	}
});


//setTimeout()

// buildDeck();
// deal();

//checkForSet('user');
//checkForSet('comp');
//setTimeout(startGame(), 0);


//GAME FLOW

// build deck
// deal
// check computer hand for matc
