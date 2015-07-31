// Create an empty object and build properties and methods on it instead of creating a bunch of global variables
var app = {};
app.bookURL = "https://www.googleapis.com/books/v1/users/115753440391396010607/bookshelves/2/volumes";
app.boozeURL = "http://lcboapi.com/products";
app.boozeKey = "MDo2NTIyNTk3NC0zNjJlLTExZTUtYTg1Zi1kYjU1YzhlYzg2YmM6YXpwU0lhS3phNTdhVDJ4UVg1b0hUTUx6ODQ5UjNaNjhsZDE3";

// Get a random array item when AJAX request is called
function randomNumber(randomArray) {
	return Math.floor(Math.random() * randomArray.length);
}

// Collect data from the user
	// User selects a mood by clicking on a button
	// Get the ID of the button they clicked and save to a global variable
	// Get the button text and insert into highlighted text in results
	// Scroll down to results section
	$('.mood-btn').on('click', function(){
		app.boozeType = $(this).data('keywords');
		highlightText = $(this).text();
		
		$('.highlight').text(highlightText);
		app.getBooze();

		$('html,body').animate({
			scrollTop: $('#results').offset().top
		}, 1000);
	});

// When "Try Again" button is clicked, scroll back up to top of page
	$('.btn').on('click', function(){
		$('html,body').animate({ scrollTop: 0 }, 1000);
	});
	
// Get data for books from NYT Bestsellers API
app.getBooks = function(){
	var booksCall = $.ajax({
		url: app.bookURL,
		type: "GET",
		dataType: "json",
		data: {
			key: "AIzaSyDitBcEotbQY_BPq2qFEimwK9ugNGzK00g"
		}
	});
	// When AJAX call is done
	$.when(booksCall).done(function(books){
		var randomBook = randomNumber(books.items);
		app.displayInfo(books.items[randomBook].volumeInfo);
	});
};

// Get data for booze from LCBO API
app.getBooze = function(){
	var boozeCall = $.ajax({
		url: app.boozeURL,
		type: "GET",
		dataType: "jsonp",
		headers : {
			Authorization : "Token token=" + app.boozeKey
		},
		data: {
			q : app.boozeType,
			per_page: 100
		}
	});
	// When AJAX call is done
	$.when(boozeCall).done(function(booze){
		var randomBooze = randomNumber(booze.result);
		app.displayInfo(booze.result[randomBooze]);
	});
};

// Display API data on page
app.displayInfo = function(data){
	console.log(data);
	// If result has an image, display booze data on the page
	if (data.image_url != null) {
		// Insert booze result title on page
		var beerTitle = data.name;
		$('#beer-title').text(beerTitle);

		//If the result has a style, insert booze result style on page
		if (data.style != null){
			var beerStyle = data.style;
			$('#beer-style').text(beerStyle);
		} else {
			$('#beer-style').text('');
		}
		//Insert booze result image on page
		$('#beer-img').attr('src', data.image_url);

		//If the result has tasting notes, insert booze result tasting note on page
		if (data.tasting_note != null){
			var beerNote = data.tasting_note;
			$('#beer-note').text(beerNote);
		} else {
			$('#beer-note').text('Such booze');
		}
	};

	//Display book data on the page
	if (data.imageLinks != null) {
		var bookTitle = data.title;
		$('#book-title').text(bookTitle);

		var bookAuthor = data.authors;
		$('#book-author').text(bookAuthor);

		var bookImage = data.imageLinks.thumbnail;
		$('#book-img').attr('src', bookImage);
		if (data.description != null) {
			var bookDescription = data.description;
			// Limit book description length to 100 characters
			if(bookDescription.length > 200) {
		    	bookDescription = bookDescription.substring(0,199)+"...";
			}
			$('#book-description').text(bookDescription);		
		}
	}
	

};

// Initialize methods
app.init = function(){
	app.getBooks();
	app.getBooze();
};


$(function(){
	app.init();
});