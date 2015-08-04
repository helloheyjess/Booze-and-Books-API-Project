var app = {};
var bookURL = "https://www.googleapis.com/books/v1/users/115753440391396010607/bookshelves/2/volumes";
app.boozeURL = "http://lcboapi.com/products";
app.boozeKey = "MDo2NTIyNTk3NC0zNjJlLTExZTUtYTg1Zi1kYjU1YzhlYzg2YmM6YXpwU0lhS3phNTdhVDJ4UVg1b0hUTUx6ODQ5UjNaNjhsZDE3";


// Collect data from the user
	$('.mood-btn').on('click', function(){
		// User selects a mood by clicking on a button
		// Get the ID of the button they clicked and save it as a variable
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
	});
	
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
		console.log(books)
		console.log(booze)
		var randomBook = randomNumber(books[0].items);
		app.displayInfo(books[0].items[randomBook].volumeInfo);

		var randomBooze = randomNumber(booze[0].result);
		app.displayInfo(booze[0].result[randomBooze]);
	});
};

// Display API data on page
app.displayInfo = function(data){
	console.log(data);
	// If booze has an image, display booze data on the page
	if (data.image_url != null) {
		// Insert booze result title on page
		var boozeTitle = data.name;
		$('#booze-title').text(boozeTitle);

		//If the result has a style, insert booze result style on page
		if (data.style != null){
			var boozeStyle = data.style;
			$('#booze-style').text(boozeStyle);
		} else {
			$('#booze-style').html('<br>');
		}
		//Insert booze result image on page
		$('#booze-img').attr('src', data.image_url);

		// Insert booze info link on page
		var boozeLink = data.name.replace(/['\s]/g, '-');
		var baseURL = "http://www.lcbo.com/lcbo/product/";
		var productURL = baseURL + boozeLink + "/" + data.id;
		$('#booze-info').attr('href', productURL);

		//If the result has tasting notes, insert booze result tasting note on page
		if (data.tasting_note != null){
			var boozeNote = data.tasting_note;
			// Limit booze description length to 200 characters
			if(boozeNote.length > 200) {
		    	boozeNote = boozeNote.substring(0,199)+"...";
			}
			$('#booze-description').text(boozeNote);
		} else {
			$('#booze-description').html('<br>');
		}
	};

	// If book has an image, display book data on the page
	if (data.imageLinks != null) {
		var bookTitle = data.title;
		$('#book-title').text(bookTitle);

		var bookAuthor = data.authors;
		$('#book-author').text(bookAuthor);

		var bookInfo = data.infoLink;
		$('#book-info').attr('href', bookInfo);

		var bookImage = data.imageLinks.thumbnail;
		$('#book-img').attr('src', bookImage);
		if (data.description != null) {
			var bookDescription = data.description;
			// Limit book description length to 200 characters
			if(bookDescription.length > 200) {
		    	bookDescription = bookDescription.substring(0,199)+"...";
			}
			$('#book-description').text(bookDescription);		
		}
	}
};

// When "Try Again" button is clicked, refresh page
	$('.btn').on('click', function(){
		location.reload();
	});

app.init = function(){
	app.getBoozeAndBooks();
};

$(function(){
	app.init();
});