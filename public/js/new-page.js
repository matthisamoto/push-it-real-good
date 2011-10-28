var current_preview_string;
var count = 0;
var current_page = 1;
var search_scroll;
var results_count = 0;
var clonable_div = $('<div/>');

function killpreloader() {
  $( "#" + current_preview_string ).css( 'width', '0' );
}

// $(function() {

var container = $('<div>');


// Set up CSRF token to work with AJAX
var csrf_token = $('meta[name=csrf-token]').attr('content');

$("body").bind("ajaxSend", function(elm, xhr, s){
   if (s.type == "POST") {
      xhr.setRequestHeader('X-CSRF-Token', csrf_token);
   }
});

// Search Functions

function add_container() {
	var clone = container.clone().addClass('search-container');
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
function prepNonFlash(id, parent) {
  $('audio').each( function(e) {
	$(this).empty()
  });
  var clip = document.createElement('audio');
  clip.src = "http://api.soundcloud.com/tracks/" + id + "/stream?client_id=72325d0b84c6a7f4bbef4dd86c0a5309";
  clip.load();
  clip.id = 'audio';
  clip.autobuffer = true;
  clip.preload = 'auto';
  parent.append(clip);
  clip.play();
}
function prepFlash (id) {
  if($(current_preview_string)) killFlash();
  var swfVersionStr = "10.0.0";
  var xiSwfUrlStr = "playerProductInstall.swf";
  var flashvars = {};
  flashvars.streamURL = "http://api.soundcloud.com/tracks/" + id + "/stream?client_id=72325d0b84c6a7f4bbef4dd86c0a5309";
  var params = {};
  params.quality = "best";
  params.wmode = "transparent";
  var attributes = {};
  current_preview_string = "flashcontent_" + id;
  swfobject.embedSWF("/swf/preview.swf", current_preview_string ,"35", "35", swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);
}
function killFlash() {
  var elem = $("#" + current_preview_string);
  var par = elem.parent();
  elem.remove();
  par.prepend( clonable_div.clone().attr('id', current_preview_string) )
}
function togglePlayButton(btn, parent) {
	var id = parent.parent().attr('id');
	// $('audio').length > 0
	if( btn.hasClass('active') ){
  	  if( btn.hasClass('playing') ){
		stop_playing();
		btn.find('.pause-img').addClass('hidden');
		btn.find('.play-img').removeClass('hidden');
		btn.removeClass('playing');
	  } else {
		start_playing(id, parent);
		btn.find('.pause-img').removeClass('hidden');
		btn.find('.play-img').addClass('hidden');
		btn.addClass('playing');
	  }
	}
	else {
	  $('.play').removeClass('active');
	  $('.pause-img').addClass('hidden');
	  $('.play-img').removeClass('hidden');
	  start_playing(id, parent);
	  btn.addClass('active');
	  btn.addClass('playing');
	  btn.find('.pause-img').removeClass('hidden');
	  btn.find('.play-img').addClass('hidden');
	}
}
function stop_playing() {
  if( $("body").hasClass( "iphone" ) || $("body").hasClass( "android" ) ) {
	var clip = document.getElementById('audio')
	clip.pause();
  } else {
	killFlash();
  }
}
function resume_playing() {
  if( $("body").hasClass( "iphone" ) || $("body").hasClass( "android" ) ) {	
	var clip = document.getElementById('audio')
	clip.play();
  } else {
	
  }
}
function start_playing(id, parent) {
  if( $("body").hasClass( "iphone" ) || $("body").hasClass( "android" ) ) {
    prepNonFlash(id, parent);
  } else {
    prepFlash(id);
  }
}
function search_soundcloud() {
  results_count = 0;

  // Remove stuff
  $('.close-results').remove();
  if( $('.search-tracks .division-inner .LV_validation_message') ) $('.search-tracks .division-inner .LV_validation_message').remove();

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
   	  preview_line += '<a href="#" class="play left"><div id="flashcontent_' + e['id'] + '"></div><img src="/images/play.png" alt="Preview" title="Preview" class="play-img"/><img src="/images/stop.png" alt="Preview" title="Preview" class="pause-img hidden" /></a>' + "\n";
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
  return html;	
}
function initSearchFunctionality(which) {
	
  $('.play').click( function (e){
    e.preventDefault();
    togglePlayButton($(this), $(this).parent(), $(this).parent().attr('id'))
  })

  $('.select-track').click( function(e) {
    e.preventDefault();
	killFlash();
	
    $("#page_sound_url").val( 'http://api.soundcloud.com/tracks/' + $(this).parent().parent().parent().attr('id') + '/stream');
	$("#page_track_name").val( $(this).parent().parent().parent().find('.track-header .track-title a').text() );
	$("#page_track_url").val( $(this).parent().parent().parent().find('.track-header .track-title a').attr('href') );
	$("#page_track_author").val( $(this).parent().parent().find('.track_author').text() );
	$("#page_track_author_url").val( $(this).parent().parent().find('.track_author').attr('href') );
		/*
    html += '<input type="hidden" name="page[track_name]" class="url" value="' + $(this).parent().parent().parent().find('.track-header .track-title a').text() + '" />';
    html += '<input type="hidden" name="page[track_url]" class="url" value="' + $(this).parent().parent().parent().find('.track-header .track-title a').attr('href') + '" />';
    html += '<input type="hidden" name="page[track_author]" class="url" value="' + $(this).parent().parent().find('.track_author').text() + '" />';
    html += '<input type="hidden" name="page[track_author_url]" class="url" value="' + $(this).parent().parent().find('.track_author').attr('href') + '" />';
*/
    $('.track-name').empty().css("background-color","rgba(0, 132, 0, 0.60)").css("padding","5px 0").css("cursor","pointer").append("<span class=\"added\">Added track:</span> " + $(this).parent().parent().parent().find('span.track-title').text()).click( function(){ $('.track-name').empty().css("background-color","transparent").css("padding","0"); $('.id-container').empty(); });
    toggleSections();
  });

  if(which == "initial") {
	if( $('.close-results').length == 0 ) $('.search-button').after( '<a href="#" class="close-results button">Clear Results</a>' );
	$('.close-results').click( function(e) {
	  e.preventDefault();
	  $('.search-results').empty();
	  $('.search-results').append('	<div class="upload-coming-soon"></div>');
	  $(this).remove();
	});
    search_scroll = $('.scroll-pane').jScrollPane({ verticalDragMaxHeight: 25, verticalDragMinHeight: 25 }).data('jsp');
	$('.scroll-pane').bind('jsp-scroll-y', function(event, scrollPositionY, isAtTop, isAtBottom) {
      if(isAtBottom){ moreResults(); $(this).unbind("jsp-scroll-y") }
	});
  } else {
	search_scroll.reinitialise();
	$('.scroll-pane').bind('jsp-scroll-y', function(event, scrollPositionY, isAtTop, isAtBottom) {
      if(isAtBottom){ moreResults(); $(this).unbind("jsp-scroll-y") }
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

// Naming Functions

$("#page_tagline").keyup( function() {
	$('.title-preview').empty().text($(this).val())
	if($('.title-preview').text() == "") $('.title-preview').append('My Title')
})

// OnLoad Actions

$('select#button_style_name').selectBox();
retrieve_colors();

$("select#button_style_name").change( retrieve_colors );

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
	$('.choose-button').animate({ height: button_height }, 500, function() { document.getElementById("page_title_url").focus(); } );
	$('.button-header').css('background-image',"url(/images/orange_tile.png)");
	$('.sound-header').css('background-image',"url(/images/gray_tile.png)");
  } else { 
    $('.search-tracks').animate({ height: search_height }, 500);
	$('.choose-button').animate({ height: "0" }, 500);
	$('.button-header').css('background-image',"url(/images/gray_tile.png)");
	$('.sound-header').css('background-image',"url(/images/orange_tile.png)");
  }
}
var button_height = 630;
var search_height = 630;

$('.choose-button').css({ height: "0" });

$('.button-header').click( function(e) {
  toggleSections();
});
$('.sound-header').css('background-image',"url(/images/orange_tile.png)").click( function(e) {
  toggleSections();
});

// Validation

var titleValid = new LiveValidation("page_title_url", { validMessage: "✔" , onlyOnSubmit: true } );
titleValid.add( Validate.Format, { pattern: /^[A-Za-z0-9]*[A-Za-z0-9][A-Za-z0-9]*$/ , failureMessage: "Letters and Numbers Only" });
titleValid.add( Validate.Presence, { failureMessage: "Letters and Numbers Only." });

function check_url() {
  document.getElementById('create-new-button').disabled = true;
  if( $('#page_title_url').val() ) {
	$.post('/test_url', { title_url: $('#page_title_url').val() }, 
      function(data) {
        if(data.result == "fail") {
	      if( $('#page_title_url').parent().find('.LV_validation_message') )  $('#page_title_url').parent().find('.LV_validation_message').remove();
          var errorMessage = clonable_div.clone().addClass('LV_validation_message').addClass('LV_invalid').text('This URL Is Unavailable');
          $('#page_title_url').addClass('LV_invalid_field').after( errorMessage )
        } else {
	      if( $('#page_title_url').parent().find('.LV_validation_message') )  $('#page_title_url').parent().find('.LV_validation_message').remove();
	      if( $('#page_title_url').hasClass('LV_invalid_field') ) $('#page_title_url').removeClass('LV_invalid_field')
	      document.getElementById('create-new-button').disabled = false;
        }
      }, "json");
  } else {
    if( $('#page_title_url').parent().find('.LV_validation_message') )  $('#page_title_url').parent().find('.LV_validation_message').remove();
    var errorMessage = clonable_div.clone().addClass('LV_validation_message').addClass('LV_invalid').text('Cannot Be Empty');
    $('#page_title_url').addClass('LV_invalid_field').after( errorMessage )
  }
}

$("#page_title_url").keyup( function(e) {
	check_url();
});
$('#page_title_url').change( function(e) {
	check_url();
});
$('#page_title_url').focus( function(e) {
	check_url();
});
$('#page_title_url').blur( function(e) {
	check_url();
});

$("input[type=submit]").click( function (e) {
	if( $(".id-container input.url").val() ) {
		
	  if( $('#page_title_url').hasClass('LV_invalid_field') ) return false;
	
	} else {
		e.preventDefault();
		var errorMessage = clonable_div.clone().addClass('LV_validation_message').addClass('LV_invalid').text('You Must Select A Track To Continue');
		$('.search-tracks .division-inner').prepend( errorMessage )
		// alert("Please choose a track for your page.");
		toggleSections()
	}
	
});


// });