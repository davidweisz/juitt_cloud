var images_array;
var image_counter;
var current_image;
var magnet_link;
var isMagnet;
var movie_json;
var isIMDB;

function loadContent(url) {
	images_array = [];
	image_counter = 0;
	current_image = 0;	
	magnet_link = "";
	isMagnet = false;
	isIMDB = false;
	
	try {
		// Create the request object
		ajaxRequest = new XMLHttpRequest(); 
	
		// Register event handler
		ajaxRequest.onreadystatechange = function stateChange(){
			if (ajaxRequest.readyState==4 && ajaxRequest.status==200){
					var hidden_div = document.getElementById("hidden_div");
					hidden_div.style.visibility = "none";
					hidden_div.innerHTML = ajaxRequest.responseText;
					
					// We now process the page
					processPage(url);
				
					hidden_div.innerHTML = "";
			}	
		};
	
		// Set request parameters
		if (url.indexOf("?") == -1) {
			ajaxRequest.open( 'GET', url+"?tt="+Math.random(), true ); 
		} else {
			ajaxRequest.open( 'GET', url+"&tt="+Math.random(), true ); 
		}
	
		// Execute it 
		ajaxRequest.send(); 

		} 
		catch ( exception ) {
			alert( 'Ajax Error' );
		} 
} 

function processPage(url) {	
	$('#data_div').show();
	
	// find the magnetic link
	$('#hidden_div').find('a[href^="magnet:"]').each(function() {
		magnet_link = this.href;
		isMagnet = true;
	});
	
	if (isMagnet) {
		// alert(document.getElementById('download_link').href);
		document.getElementById('download_link').href = magnet_link;
		document.getElementById('download_link').innerHTML = "Download Here";
		
		// Add to input field for form post
		document.getElementById('micropost_magnet_link').value = magnet_link;
	}	
	
	var imdb_index = findIMDBIndex();
	if (imdb_index > 0) {
		processIMDB(imdb_index);	
		
		// wait 100 milisecs
		setTimeout(function() {
        }, 100);
		
		// Get the image poster from the imdb json
		if (movie_json != null) {
			images_array.push(movie_json.Poster);
			image_counter += 1;
			
			// Add data json to input field in the form for db post
			document.getElementById('micropost_data_json').value = JSON.stringify(movie_json);
		}
		
	} else { // No imdb link on the website
		
		// Search for posters in the website
		$('#hidden_div').find('img').each(function() {
			if (this.src.indexOf("http:") != -1) {
				images_array.push(this.src);
				image_counter += 1;
			}
		});
		
		// Give the user the ability to show the image to post
		if (image_counter > 1) {
			$('#choose_picture_div').show();			
		}
	}
	
	// Add image to document
	updateImageAndSave();
	updateCounter();
}

// Get the IMDB address index if appears
function findIMDBIndex() {
	var loaded_content = $('#hidden_div').html();
	return loaded_content.search('http://www.imdb.com/title/');
}

function processIMDB(imdb_index) {
	if (imdb_index > 0) {
		var loaded_content = $('#hidden_div').html();
		var end_index = loaded_content.indexOf('<', imdb_index);
		var imdb_address = loaded_content.substring(imdb_index, end_index);

		// IMDb ID to Search
//		var imdbLink = "tt1285016";
		var imdbLink = imdb_address.substring(26);
		imdbLink = imdbLink.slice(0, 9);

		// Send Request
		var http = new XMLHttpRequest(); 
		http.open("GET", "http://www.imdbapi.com/?i=" + imdbLink, false);
		http.send(null);

		// Response to JSON
		var imdbData = http.responseText;
		var imdbJSON = eval("(" + imdbData + ")");

		// Returns Movie Title
		//alert(JSON.stringify(imdbJSON));
		if (imdbJSON.Response == "True") {
			addMovieData(imdbJSON);

			// Save to global variable
			movie_json = imdbJSON;
		}
	}
}

function previousImage() {
	if (image_counter > 1 && current_image > 0 ) {
		current_image -= 1;
		updateImageAndSave();
		updateCounter();		
	}
}

function nextImage() {
	if (image_counter > 0 && current_image < (image_counter - 1)) {
		current_image += 1;
		updateImageAndSave();
		updateCounter();
	}
}

function updateImageAndSave() {
	document.img01.src = images_array[current_image];
	document.img01.style.width = "125px";

	// Save the selected image on the image filed for form post to db
	document.getElementById('micropost_poster_src').value = images_array[current_image];
} 

function updateCounter() {
	// Add counter result
	document.getElementById("image_counter").innerHTML = (current_image + 1) + " of " + image_counter;
}

function addMovieData(json) {
	// Example of JSON response
	// {
	// 	"Title":"American Reunion",
	// 	"Year":"2012",
	// 	"Rated":"R",
	// 	"Released":"06 Apr 2012",
	// 	"Runtime":"1 h 53 min",
	// 	"Genre":"Comedy",
	// 	"Director":"Jon Hurwitz, Hayden Schlossberg",
	// 	"Writer":"Adam Herz, Jon Hurwitz",
	// 	"Actors":"Jason Biggs, Alyson Hannigan, Seann William Scott, Chris Klein",
	// 	"Plot":"Jim, Michelle, Stifler, and their friends reunite in East Great Falls, Michigan for their high school reunion.",
	// 	"Poster":"http://ia.media-imdb.com/images/M/MV5BMTY4MTEyMzU1N15BMl5BanBnXkFtZTcwNDQ0NTc1Nw@@._V1_SX640.jpg",
	// 	"imdbRating":"7.3",
	// 	"imdbVotes":"35,400",
	// 	"imdbID":"tt1605630",
	// 	"Response":"True"
	// }
	document.getElementById("movie_data").innerHTML = 
		"<a href='" + magnet_link + "'>" + json.Title + "</a><br \>" +
		json.Plot + "<br \>" + 
		"Year: " + json.Year + " - " + 
		"Genre: " + json.Genre + " - " + 
		"Rating: " + json.imdbRating + "<br \>";
	
}

$(document).ready(function(){
//	$("input").live("click",);
	// $("form").submit( function () {
	// 	// var url = document.getElementById("url_input").value;
	// 	// loadContent(url)
	// 	alert("Will post the following: " + JSON.stringify(movie_json));
	// 	return false;
	// });
	$('textarea').bind('paste', function () {
		var el = $(this);
        setTimeout(function() {
            var url = $(el).val();
        	loadContent(url)
        }, 100);
	});
	
	$('#data_div').hide();
	$('#choose_picture_div').hide();
});