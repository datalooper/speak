/** Front-End Rendering **/

//function renderSongs(){
//    htmlHeader = "<div class='libraryHeader'>Search</div>";
//	htmlSongs = "<ul class='byAlbum'>";
//    albumArtArray = [];
//    htmlFeature = "";
//
//    $.each( SpeakPlayer.player.songs, function( key, song ) {
//
//        if(song.isFeatured){
//            htmlFeature = Handlebars.templates['featuredTrack.hbs'](song);
//        }
//
//        if($.inArray(song.artistName, albumArtArray) == -1){
//            htmlSongs += "<li id='" + song.id+"' class='song cf' ><div class='songImg'><img src='"+song.albumArtUrl+"'/></div>'";
//            htmlSongs+= "</li>";
//            albumArtArray.push(song.artistName);
//        }
//
//
//
//	});
//	htmlSongs += "</ul>";
//	SpeakPlayer.player.libraryContainer.prepend(htmlFeature).append(htmlSongs);
//}


//old style

function renderSongs(){
	htmlHeader = "<div class='songList header cf'><p class='songName'>Song Name</p><p class='artistName'>Artist</p><p class='albumName'>Album</p><p class='date'>Date Released</p><p class='genre'>Genre</p></div><ul class='bySongs' id='library'>";
	htmlFeature = "";
	htmlSongs = "";
	$.each( SpeakPlayer.player.songs, function( key, song ) {
		if(!song.isFeatured){
		song.albumArtUrl = song.albumArtUrl != null ? song.albumArtUrl : "";
			htmlSongs += "<li id='" + song.id+"' class='song cf' ><div class='playOptions'><span class='expand'>+</span><a class='playNow' href='#'>Play Now</a><a class='playNext' href='#'>Play Next</a><a class='addToPlaylist' href='#'>Add To Playlist</a></div><div class='songImg'><img src='"+song.albumArtUrl+"'/></div><div class='songInfo'><p class='songName'>"+song.songName+"</p><a class='artistName' href=''>"+song.artistName+"</a><p class='albumName'>"+song.albumName+"</p><p class='date'>"+song.releaseDate+"</p><p class='genre'>";

			$.each(song.genres, function(key, genre){
				htmlSongs += "<span>"+genre["name"]+"</span>";
			});

			htmlSongs+= "</p></div></li>";
		} else{
			htmlFeature += "<div class='featured-song cf'><div class='songImg'><img src='"+song.albumArtUrl+"'/></div><div class='songInfo'><p class='status'>Featured</p><p class='songName'>"+song.songName+" <span class='by'>by</span></p><a class='artistName' href=''>"+song.artistName+"</a><p class='tag'>Categorized as ";
			$.each(song.genres, function(key, genre){
				htmlFeature += "<a href='#' class='genre'>"+genre["name"]+"</a>";
			});
			htmlFeature += ", released on <a class='album' href='#'>"+song.albumName + "</a>, " + song.releaseDate+"</p><p class='trackInfo'>"+song.trackInfo+"</p></div></div>";
		}

	});
	htmlSongs += "</ul>";
	SpeakPlayer.player.libraryContainer.prepend(htmlFeature).append(htmlHeader+htmlSongs);
}

function renderPlaylist(){
	var html = "<ul class='cf' id='playlistUl'></ul>";
	SpeakPlayer.player.playlistContainer.append(html);
	setupScrollSlider();
}
function renderPlayer(){	
	var html = '<div id="player"><div class="cf seekBarContainer"><span class="songTime" id="startTime">0:00</span><div class="seekBar"></div><span class="songTime" id="endTime">0:00</span></div><div class="currentlyPlaying"><p><span class="songName"></span><span class="artist"></span></p></div><div id="controls"><a  href="#" class="playlist">'+playlistSVG+'</a><a href="#" class="volume">'+volumeSVG+'<div id="volumeContainer"><div id="volumeSlider"></div></div></a><a href="#" class="previous">'+prevSVG+'</a><a href="#" class="playPause">'+playSVG+'</a><a href="#" class="next">'+nextSVG+'</a></div></div>';

	SpeakPlayer.player.playerContainer.append(html);
	SpeakPlayer.player.isInitialized = true;
	SpeakPlayer.player.el = SpeakPlayer.player.playerContainer.find('#player');
	SpeakPlayer.player.controls.el = SpeakPlayer.player.playerContainer.find('#controls');
	SpeakPlayer.player.controls.playPause = SpeakPlayer.player.playerContainer.find('.playPause');
	SpeakPlayer.player.controls.stop = SpeakPlayer.player.playerContainer.find('.stop');
	SpeakPlayer.player.controls.next = SpeakPlayer.player.playerContainer.find('.next');
	SpeakPlayer.player.controls.playlist = SpeakPlayer.player.playerContainer.find('.playlist');
	SpeakPlayer.player.controls.volumeSlider = SpeakPlayer.player.playerContainer.find('#volumeSlider').slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 60,
	});
	SpeakPlayer.player.controls.seekBar = SpeakPlayer.player.playerContainer.find('.seekBar').slider({
		range: "min",
		value: 0,
		min: 1
	});
	SpeakPlayer.player.controls.startTime = SpeakPlayer.player.playerContainer.find('#startTime');
	SpeakPlayer.player.controls.endTime = SpeakPlayer.player.playerContainer.find('#endTime');
	SpeakPlayer.player.currentlyPlayingArtistEl = SpeakPlayer.player.playerContainer.find('.currentlyPlaying .artist');
	SpeakPlayer.player.currentlyPlayingSongNameEl = SpeakPlayer.player.playerContainer.find('.currentlyPlaying .songName');
	setListeners();
	setupSeekbar();
	setupVolumeSlider();
	bindPlayer();
}


function setupVolumeSlider(){
	var volumeSlider = SpeakPlayer.player.controls.volumeSlider;
	volumeSlider.on('slide', function(event, ui){
		if(audio != null){
			console.log(ui.value);
			audio.volume = ui.value/100;
		}
	});
}
//sets up listeners on seekbar. only needs to happen once since seekbars are single instance.
function setupSeekbar(){
	seekBar = SpeakPlayer.player.controls.seekBar;
	//stops seeking when use begins drag
	seekBar.on( "slidestart", function() {
		clearInterval(audio_clock);	
	});
	seekBar.on( "slidechange", function( event, ui ) {
		//track time change on seekbar
		SpeakPlayer.player.controls.startTime.html(secondsToTime(ui.value/10));
	} );
	//resumes seeking when user ends drag
	seekBar.on( "slidestop", function( event, ui ) {
		
		value = seekBar.slider("value");
		SpeakPlayer.player.audioElement.currentTime = value/10;
		if(SpeakPlayer.player.getCurrentlyPlayingSong().isPlaying){
			audio_clock = startSeeking();
		}
	} );
}

function secondsToTime(raw){
	var time = parseInt(raw,10);
	time = time < 0 ? 0 : time;

	var minutes = Math.floor(time / 60);
	var seconds = time % 60;

	seconds = seconds < 10 ? "0"+seconds : seconds;
	return minutes+":"+seconds;
}
function setupScrollSlider(){
	SpeakPlayer.player.playlistContainer.mCustomScrollbar({
		axis:"x",
		advanced:{
			autoExpandHorizontalScroll:true
		}
	});
}