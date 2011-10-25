$(document).ready(function() {
var count = 0;
var container = $('<div>', { class: 'search-container' });
var current_page = 1;
// Set up CSRF token to work with AJAX
var csrf_token = $('meta[name=csrf-token]').attr('content');
var search_scroll;
var results_count = 0;

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
  results_count = 0;
  $('.close-results').remove();
  var search_term = $('input#search').val();
  $.get('http://m.soundcloud.com/_api/tracks/', { q: search_term, limit: 10, client_id: "72325d0b84c6a7f4bbef4dd86c0a5309", filter: "streamable", format: 'json' }, 
    function(data) {
	  var html = "";
	  html += '<div class="search scroll-pane">' + "\n";
      html += parseResults(data);
	  html += '</div>' + "\n";
      $('.search-results').empty().scrollTop(0).append(html);
	  initSearchFunctionality("initial");
    }, "json");
}
function moreResults() {
  results_count++;
  var search_term = $('input#search').val();
  $.get('http://m.soundcloud.com/_api/tracks/', { q: search_term, limit: 10, offset: 10 * results_count, client_id: "72325d0b84c6a7f4bbef4dd86c0a5309", filter: "streamable", format: 'json' }, 
	function(data) {
	  html = parseResults(data);
	  search_scroll.getContentPane().append(html);
      initSearchFunctionality("subsequent");
	}, "json");	
}
function parseResults(data) {
  var html = "";
  $.each(data, function(i, e) {
	
    var duration = Math.floor(parseInt(e['duration'])/1000);
	var min = Math.floor(duration / 60);
	var sec = duration - ( min * 60 );
	if(sec < 10) sec = "0" + sec;
	
    html += '<div class="track clearfix" id="' + e['id'] + '">' + "\n";
    
    html += '<p class="track-header"><span class="track-title"><a href="' + e['permalink_url'] + '" target="_blank">' + e['title'] + '</a></span></p>' + "\n";
	
	var preview_line = "";
    
    if(e['streamable'] == true)
    {
   	  preview_line += '<a href="#" class="play left"><img src="/images/play.png" alt="Preview" title="Preview" class="play-img"/><img src="/images/pause.png" alt="Preview" title="Preview" class="pause-img hidden" /></a>' + "\n";
    } else 
    {
	  preview_line += '<img src="/images/not-available.png" alt="Not Available" title="Not Available" class="left" />' + "\n";
	}
	
	preview_line += '<p class="duration left">' + min + ':' + sec + '</p>' + "\n";
	
	preview_line += '<p class="from left"><span class="from-script">from</span> <a href="' + e['user']['permalink_url'] + '" target="_blank" class="track_author">' + e['user']['username'] + '</a></p>';
	
	if(e['streamable'] == true)
	{
      preview_line += '<p class="left"><a href="#" class="button select-track left" alt="Use This Track In Your Page" title="Use This Track In Your Page">Use This</a></p>' + "\n";
	} else 
	{
	  preview_line += '<span class="left no-stream">This track is not streamable. <a href="#" class="tooltip" onClick="javascript:function(e){e.preventDefault();}">Why?<span>Right now, SoundCloud\'s API does not allow a combination request of search terms and filtering streamable content. If this ever changes, you will not see non-streamable tracks in this list anymore. For now, though, these tracks will appear in our results. We\'re sorry.</span></a></span>';
	}
	
	html += "<div class=\"preview-line clearfix\">" + preview_line + "</div>\n";
	
	if(e['genre']) html += '<p class="genre clearfix"> Genre: ' + e['genre'] + "</p>" + "\n";
	
	html += '</div>' + "\n";
	
  });

  console.log( html )	
  return html;	
}
function initSearchFunctionality(which) {
	
  $('.play').click( function (e){
    e.preventDefault();
    togglePlayButton($(this), $(this).parent(), $(this).parent().attr('id'))
  })

  $('.select-track').click( function(e) {
    e.preventDefault();
    var html = '<input type="hidden" name="page[sound_url]" class="url" value="http://api.soundcloud.com/tracks/' + $(this).parent().parent().parent().attr('id') + '/stream" />';
    html += '<input type="hidden" name="page[track_name]" class="url" value="' + $(this).parent().parent().parent().find('.track-header .track-title a').text() + '" />';
    html += '<input type="hidden" name="page[track_url]" class="url" value="' + $(this).parent().parent().parent().find('.track-header .track-title a').attr('href') + '" />';
    html += '<input type="hidden" name="page[track_author]" class="url" value="' + $(this).parent().parent().find('.track_author').text() + '" />';
    html += '<input type="hidden" name="page[track_author_url]" class="url" value="' + $(this).parent().parent().find('.track_author').attr('href') + '" />';
    $('.id-container').empty().append(html);
    $('.track-name').empty().css("background-color","rgba(0, 255, 0, 0.30)").css("border","1px solid #090").append("Added track: " + $(this).parent().parent().parent().find('span.track-title').text()).click( function(){ $('.track-name').empty().css("background-color","transparent").css("border","1px solid transparent"); $('.id-container').empty(); });
    toggleSections();
  });

  if(which == "initial") {
	$('.search-button').after('<a href="#" class="close-results button">Clear Results</a>');
	$('.close-results').click( function(e) {
	  e.preventDefault();
	  $('.search-results').empty();
	  $('.search-results').append('	<div class="upload-coming-soon">'+
	      '<p>&mdash; OR &mdash;</p>' + 
		  '<p>Upload your own sound <span class="plus">+</span></p>' + 
		'<p class="coming-soon-notice">COMING SOON!</p>' + 
		'</div>')
	  $(this).remove();
	});
    search_scroll = $('.scroll-pane').jScrollPane({ verticalDragMaxHeight: 25, verticalDragMinHeight: 25 }).data('jsp');
	$('.scroll-pane').bind('jsp-scroll-y', function(event, scrollPositionY, isAtTop, isAtBottom) {
      if(isAtBottom){ console.log("bottom"); moreResults(); $(this).unbind("jsp-scroll-y") }
	});
  } else {
	search_scroll.reinitialise();
	$('.scroll-pane').bind('jsp-scroll-y', function(event, scrollPositionY, isAtTop, isAtBottom) {
      if(isAtBottom){ console.log("bottom"); moreResults(); $(this).unbind("jsp-scroll-y") }
	});
  }
}

// Button Functions

function retrieve_colors() {
  $.post('/retrieve_colors', { style: $("select#button_style_name option:selected").attr("value") }, function(data) {	
    $('.choose-color').empty().append(data);
	preview_image();
	$("input[type=radio]").change( function () {
	  preview_image();
	});
  });
}
function preview_image() {
	$('.image-preview span.button-preview').empty().append("<image src=\"/images/" + $('#button_style_name option:selected').val().toLowerCase() + "_" +  $("input[name=button_color]:checked").attr("value").toLowerCase() + ".png\" height= \"150\" width=\"300\" />");
	$('.image-preview span.button-preview img').mousedown( function(e){ $('.image-preview img').css('margin-left', '-150px'); })
	$('.image-preview span.button-preview img').mouseup( function(e){ $('.image-preview img').css('margin-left', '0'); })
	$('.button-url').empty().append('<input type="hidden" name="page[button_url]" class="url" value="' + $('#button_style_name option:selected').val().toLowerCase() + "_" +  $("input[name=button_color]:checked").attr("value").toLowerCase() + '" />');
	
}
function moveScreen(direction) {
	var distance = 0;
	if(direction == "forward") {
	  current_page++;
	  // track_progress();
	  distance = -642;	
	} else {
	  current_page--
	  // track_progress();
	  distance = 642;
	}
	var position = $('.create-new').position().left;
	$('.create-new').animate({ left: position + distance + "px" }, 500, function() { } );
}
function track_progress() {
	switch(current_page) {
		case 1:
		  $('.step-one').addClass('step-active');
		  if($('.step-two').hasClass('step-active')) $('.step-two').removeClass('step-active');
		  if($('.spacer-1').hasClass('spacer-active')) $('.spacer-1').removeClass('spacer-active');
		  break;
		case 2:
		  $('.step-two').addClass('step-active');
		  if($('.step-three').hasClass('step-active')) $('.step-three').removeClass('step-active');
		  if($('.spacer-2').hasClass('spacer-active')) $('.spacer-2').removeClass('spacer-active');
		  $('.spacer-1').addClass('spacer-active');
		  break;
		case 3:
		  $('.step-three').addClass('step-active');
		  $('.spacer-2').addClass('spacer-active');
		  break;
	}
}

// Naming Functions

var titleValid = new LiveValidation("page_title_url");
titleValid.add( Validate.Format, { pattern: /^[A-Za-z0-9]*[A-Za-z0-9][A-Za-z0-9]*$/ });

$("#page_tagline").keyup( function() {
	$('.title-preview').empty().text($(this).val())
	if($('.title-preview').text() == "") $('.title-preview').append('My Tagline')
})

// OnLoad Actions
$('select#button_style_name').selectBox();
retrieve_colors();
$("select#button_style_name").change( retrieve_colors );

$("input[type=submit]").click( function (e) {
	if( $(".id-container input.url").val()){
	  if( $("#page_title_url").val()){
		
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
$('#search').click( function(e) {
	if($(this).val() == "Search SoundCloud for Tracks") {
		$(this).val("");
	}
})
$('.next').each( function() {
  $(this).click( function(e) {
	e.preventDefault();
    moveScreen("forward");
    $('.search-results').empty();
    $('.close-results').remove();
  });
});
$('.prev').each( function() {
  $(this).click( function(e) {
	e.preventDefault();
    moveScreen("backward");
  });
});

// Hiding and unHiding the stations

function toggleSections() {
  if( $('.search-tracks').height() > 0 ) {
	$('.search-tracks').animate({ height: "0" }, 500);
	$('.choose-button').animate({ height: button_height }, 500);
	$('.button-header').css('background-color',"rgba( 241, 67, 6, 0.8 )");
	$('.sound-header').css('background-color',"rgba( 40, 38, 37, 0.8 )");
  } else { 
    $('.search-tracks').animate({ height: search_height }, 500);
	$('.choose-button').animate({ height: "0" }, 500);
	$('.button-header').css('background-color',"rgba( 40, 38, 37, 0.8 )");
	$('.sound-header').css('background-color',"rgba( 241, 67, 6, 0.8 )");
  }
}
var button_height = 630;
var search_height = 455;

$('.choose-button').animate({ height: "0" }, 500);


$('.button-header').click( function(e) {
  toggleSections();
});
$('.sound-header').css('background-color',"rgba( 241, 67, 6, 0.8 )").click( function(e) {
  toggleSections();
});

// track_progress();

});