var count = 0;
var container = $('<div>', { class: 'search-container' });

// Set up CSRF token to work with AJAX
var csrf_token = $('meta[name=csrf-token]').attr('content');
$("body").bind("ajaxSend", function(elm, xhr, s){
   if (s.type == "POST") {
      xhr.setRequestHeader('X-CSRF-Token', csrf_token);
   }
});

// Search Functions
function add_container() {
	var clone = container.clone();
	$('.search-results').prepend(clone);
}
function create_audio(parent, url) {
  $('audio').each( function(e) {
	$(this).remove()
  });
  var clip = document.createElement('audio');
  clip.src = "http://api.soundcloud.com/tracks/" + url + "/stream?client_id=72325d0b84c6a7f4bbef4dd86c0a5309";
  clip.load();
  clip.id = 'audio';
  clip.autobuffer = true;
  clip.preload = 'auto';
  parent.append(clip);
  clip.play();
}
function togglePlayButton(btn, parent, url) {
	if($('audio').length > 0 && btn.hasClass('active')){
  	  if(btn.hasClass('playing')){
		var clip = document.getElementById('audio')
		clip.pause();
		btn.find('.pause-img').addClass('hidden');
		btn.find('.play-img').removeClass('hidden');
		btn.removeClass('playing');
	  } else {
	    var clip = document.getElementById('audio')
		clip.play();
		btn.find('.pause-img').removeClass('hidden');
		btn.find('.play-img').addClass('hidden');
		btn.addClass('playing');
	  }
	}
	else {
	  $('.play').removeClass('active');
	  $('.pause-img').addClass('hidden');
	  $('.play-img').removeClass('hidden');
	  create_audio(parent, url)
	  btn.addClass('active');
	  btn.addClass('playing');
	  btn.find('.pause-img').removeClass('hidden');
	  btn.find('.play-img').addClass('hidden');
	}
}
function search_soundcloud() {
	
  var search_term = $('input#search').val();
  $.get('http://m.soundcloud.com/_api/tracks/', { q: search_term, limit: 10, client_id: "72325d0b84c6a7f4bbef4dd86c0a5309", filter: "streamable", format: 'json' }, function(data) {	
    
    //add_container();
    var html = "";
	html += '<p class="header left">Keyword Search: ' + search_term + '</p>' + "\n";
	html += '<p class="right"><a href="#" class="close-results button">Clear Results</a></p>' + "\n";
	html += '<div class="clearfix"></div>' + "\n";
	html += '<div class="search">' + "\n";
	html += '<div class="tracks">' + "\n";
	$.each(data, function(i, e) {
	  html += '<div class="track clearfix" id="' + e['id'] + '">' + "\n";
	  html += '<p class="track-header"><span class="track-title">' + e['title'] + '</span><span class="track-artist"> from <a href="' + e['user']['permalink_url'] + '" target="_blank" class="track_author">' + e['user']['username'] + '</a></span></p>' + "\n";
	  if(e['streamable'] == true){
		html += '<a href="#" class="play left"><img src="/images/play.png" alt="Preview" title="Preview" class="play-img"/><img src="/images/pause.png" alt="Preview" title="Preview" class="pause-img hidden" /></a>' + "\n";
	  } else {
		html += '<img src="/images/not-available.png" alt="Not Available" title="Not Available" class="left" />' + "\n";
	  }
	  var duration = Math.floor(parseInt(e['duration'])/1000);
	  var min = Math.floor(duration / 60);
	  var sec = duration - ( min * 60 );
	  if(sec < 10) sec = "0" + sec;
	  html += '<p class="duration left">' + min + ':' + sec + '</p>' + "\n";
	  
	  html += '<a href="' + e['permalink_url'] + '" class="link-out button left" title="See Track on SoundCloud" alt="See Track on SoundCloud" target="_blank">SoundCloud Page</a>' + "\n";
	  if(e['streamable'] == true){
        html += '<a href="#" class="button select-track left" alt="Use This Track In Your Page" title="Use This Track In Your Page">Use This</a>' + "\n";
	  } else {
	    html += '<span class="left no-stream">This track is not streamable. <a href="#" class="tooltip" onClick="javascript:function(e){e.preventDefault();}">Why?<span>Right now, SoundCloud\'s API does not allow a combination request of search terms and filtering streamable content. If this ever changes, you will not see non-streamable tracks in this list anymore. For now, though, these tracks will appear in our results. We\'re sorry.</span></a></span>';
	  } 
	  if(e['genre']) html += '<p class="genre left">Genre: ' + e['genre'] + '</p>' + "\n";
	  html += '</div>' + "\n";
	});
	html += '</div>' + "\n";
	html += '</div>' + "\n";
    $('.search-results').empty().scrollTop(0).append(html);
	$('.play').click( function (e){
	  e.preventDefault();
	  //create_audio($(this).parent(), $(this).parent().attr('id'));
	  togglePlayButton($(this), $(this).parent(), $(this).parent().attr('id'))
	})
	$('.close-results').click( function(e) {
	  e.preventDefault();
	  $('.search-results').empty();
	
	});
	$('.select-track').click( function(e) {
	  e.preventDefault();
	  var html = '<input type="hidden" name="page[sound_url]" class="url" value="http://api.soundcloud.com/tracks/' + $(this).parent().attr('id') + '/stream" />';
	  html += '<input type="hidden" name="page[track_name]" class="url" value="' + $(this).parent().find('span.track-title').text() + '" />';
	  html += '<input type="hidden" name="page[track_url]" class="url" value="' + $(this).parent().find('span.track-artist a').attr('href') + '" />';
	  html += '<input type="hidden" name="page[track_author]" class="url" value="' + $(this).parent().find('span.track-artist').text().split('from ')[1] + '" />';
	  html += '<input type="hidden" name="page[track_author_url]" class="url" value="' + $(this).parent().find('.link-out').attr('href') + '" />';
	  $('.id-container').empty().append(html);
	  $('.track-name').empty().css("display","block").append("Added track: " + $(this).parent().find('span.track-title').text())
	  // $('.search').remove();
	});
	
  }, "json");

}
// Button Functions
function retrieve_colors() {
  $.post('/retrieve_colors', { style: $("select#button_style_name option:selected").attr("value") }, function(data) {	
    $('.choose-color').empty().append(data);
	preview_image();
	$("select#page_button_url").change( function () {
	  preview_image();
	});
  });
}
function preview_image() {
	$('.image-preview').empty().append("<image src=\"/images/" + $("select#page_button_url option:selected").attr("value") + ".png\" />");
}
function moveScreen(direction) {
	var distance = 0;
	if(direction == "forward") {
	  distance = -960;	
	} else {
	  distance = 960;
	}
	var position = $('.create-new').position().left;
	$('.create-new').animate({ left: position + distance + "px" }, 500, function() { } );
}
// OnLoad Actions
retrieve_colors();
$("select#button_style_name").change( retrieve_colors );
$("input[type=submit]").click( function (e) {
	if( $(".id-container input.url").val()){
	  if( $("#page_title_url").val()){
		if( $("#page_tagline").val()) {
		  
		} else {
		    e.preventDefault();
			alert("Please provide a tagline for your page");
		}
	  } else {
	    e.preventDefault();
		alert("Please provide a name for your page");
	  }
	} else {
		e.preventDefault();
		alert("Please choose a track for your page.");
		$('.create-new').animate({ left: "0px" }, 500, function() { } );
	}
	
});
$('.search-button').click( function (e) {
	e.preventDefault();
	search_soundcloud();
})
$('#search').keypress(function(e) {
	if(e.which == 13) {
		e.preventDefault();
		search_soundcloud();
	}
});
$('.next').each( function() {
  $(this).click( function(e) {
	e.preventDefault();
    moveScreen("forward");
    $('.search-results').empty();
  });
});
$('.prev').each( function() {
  $(this).click( function(e) {
	e.preventDefault();
    moveScreen("backward");
  });
});