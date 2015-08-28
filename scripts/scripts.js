var app = {};
var bookURL = "";
app.boozeURL = "http://lcboapi.com/products";
app.boozeKey = "MDo2NTIyNTk3NC0zNjJlLTExZTUtYTg1Zi1kYjU1YzhlYzg2YmM6YXpwU0lhS3phNTdhVDJ4UVg1b0hUTUx6ODQ5UjNaNjhsZDE3";

app.getBoozeAndBooks = function(){
	// Get data for books from Google Books API
	var booksCall = $.ajax({
		url: bookURL,
		type: "GET",
		dataType: "json",
		data: {
			key: "AIzaSyDitBcEotbQY_BPq2qFEimwK9ugNGzK00g"
		}
	});

	// Get data for booze from LCBO API
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

	// Get a random array item when AJAX request is called
	function randomNumber(randomArray) {
		return Math.floor(Math.random() * randomArray.length);
	}

	// When the calls are completed, retrieve a random book and booze and display on the page
	$.when(booksCall, boozeCall).done(function(books, booze) {
		var randomBook = randomNumber(books[0].items);
		app.displayBook(books[0].items[randomBook].volumeInfo);

		var randomBooze = randomNumber(booze[0].result);
		app.displayBooze(booze[0].result[randomBooze]);
	});
};

// Display API data on page
app.displayBooze = function(data){
	// Display booze title
	$boozeTitle = $('<h4>');
	$boozeTitle.text(data.name);

	//If the result has a style, display booze style
	if (data.style != null){
		$boozeStyle = $('<h5>');
		$boozeStyle.text(data.style);
	} else {
		$boozeStyle.text(" ");
	}

	//Display booze image
	$boozeImageContainer = $('<div>').addClass('img-container');
	$boozeImage = $('<img>').addClass('booze-img');
	if(data.image_url != null) {
		$boozeImage.attr('src', data.image_url);
	} else {
		$boozeImage.attr('src', 'images/noimage.jpg');
	}
	$boozeImageContainer.append($boozeImage);

	//If the result has tasting notes, display booze tasting note
	$boozeDescription = $('<p>');
	
	if (data.tasting_note != null){
	// 	// Limit booze tasting note length to 200 characters
		var boozeNote = data.tasting_note;
		if(boozeNote.length > 200) {
	    	boozeNote = boozeNote.substring(0,199)+"...";
		}
		$boozeDescription.text(boozeNote);
	} else {
		$boozeDescription.text(" ");
	}

	// Display booze link
	var boozeLink = data.name.replace(/['\s]/g, '-');
	var baseURL = "http://www.lcbo.com/lcbo/product/";
	var productURL = baseURL + boozeLink + "/" + data.id;
	$boozeLink = $('<a>');
	$boozeLink.attr('href', productURL);
	$boozeLink.html('See this booze on LCBO');
	$('#booze').append($boozeTitle, $boozeStyle, $boozeImageContainer, $boozeDescription, $boozeLink);

};

app.displayBook = function(data) {
	// If book has an image, display book data on the page
	//Display book title
	$bookTitle = $('<h4>');
	$bookTitle.text(data.title);

	//Display book author
	$bookAuthor = $('<h5>');
	$bookAuthor.text(data.authors);

	//Display book thumbnail
	$bookImageContainer = $('<div>').addClass('img-container');
	$bookImage = $('<img>').addClass('book-img');
	$bookImage.attr('src', data.imageLinks.thumbnail);
	$bookImageContainer.append($bookImage);

	//Display book description
	if (data.description != null) {
		$bookDescription = $('<p>');
		$bookDescription.text(data.description);	
	}

	//Display book link
	$bookLink = $('<a>');
	$bookLink.attr('href', data.infoLink);
	$bookLink.html('See this book on Google Books');
	$('#book').append($bookTitle, $bookAuthor, $bookImageContainer, $bookDescription, $bookLink);
}

app.init = function(){
	// Collect data from the user
	$('.mood-btn').on('click', function(){
		$('#book').empty();
		$('#booze').empty();
		// User selects a mood by clicking on a button
		// Get the data attribute of the button they clicked and save it as a variable
		app.boozeType = $(this).data('boozekeyword');
		app.bookType = $(this).data('bookkeyword');

		// URL for Google Books API call changes depending on selection
		if (app.bookType === "bold") {
			bookURL = "https://www.googleapis.com/books/v1/users/115753440391396010607/bookshelves/1006/volumes";
		} else if (app.bookType === "sweet") {
			bookURL = "https://www.googleapis.com/books/v1/users/115753440391396010607/bookshelves/1002/volumes";
		} else if (app.bookType === "dark") {
			bookURL = "https://www.googleapis.com/books/v1/users/115753440391396010607/bookshelves/1003/volumes";
		} else if (app.bookType === "cranky") {
			bookURL = "https://www.googleapis.com/books/v1/users/115753440391396010607/bookshelves/1004/volumes";
		} else if (app.bookType === "mysterious") {
			bookURL = "https://www.googleapis.com/books/v1/users/115753440391396010607/bookshelves/1005/volumes";
		}

		// Get the button text and insert into highlighted text in results-title
		highlightText = $(this).text();
		$('.highlight').text(highlightText);

		// Get results from Google Books and LCBO API's
		app.getBoozeAndBooks();

		// Show results and footer
		$('.hide-results, footer').addClass('show');

		// Scroll down to results section
		$('html,body').animate({
			scrollTop: $('#results').offset().top
		}, 1000);

		// When "Try Again" button is clicked, scroll to top
		$('.btn').on('click', function(){
			$("html, body").animate({ scrollTop: 0 }, "slow");
		});
	});
};

$(function(){
	app.init();
});