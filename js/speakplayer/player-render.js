/** Front-End Rendering **/


function renderSongs(){
	htmlHeader = "<div class='libraryHeader cf'><p class='songName'>Song Name</p><p class='artistName'>Artist</p><p class='albumName'>Album</p><p class='date'>Date Released</p><p class='genre'>Genre</p></div><ul id='library'>";
	htmlFeature = "";
	htmlSongs = "";
	$.each( player.songs, function( key, song ) {
		if(!song.isFeatured){
		song.albumArtUrl = song.albumArtUrl != null ? song.albumArtUrl : "";
			htmlSongs += "<li id='" + song.id+"' class='song cf' ><div class='playOptions'><span class='expand'>+</span><a class='playNow' href='#'>Play Now</a><a class='playNext' href='#'>Play Next</a><a class='addToPlaylist' href='#'>Add To Playlist</a></div><div class='songImg'><img src='"+song.albumArtUrl+"'/></div><div class='songInfo'><p class='songName'>"+song.songName+"</p><a class='artistName' href=''>"+song.artistName+"</a><p class='albumName'>"+song.albumName+"</p><p class='date'>"+song.release_date+"</p><p class='genre'>";

			$.each(song.genres, function(key, genre){
				htmlSongs += "<span>"+genre["name"]+"</span>";
			});

			htmlSongs+= "</p></div></li>"; 
		} else{
			htmlFeature += "<div class='featured-song cf'><div class='songImg'><img src='"+song.albumArtUrl+"'/></div><div class='songInfo'><p class='status'>Featured</p><p class='songName'>"+song.songName+" <span class='by'>by</span></p><a class='artistName' href=''>"+song.artistName+"</a><p class='tag'>Categorized as ";
			$.each(song.genres, function(key, genre){
				htmlFeature += "<a href='#' class='genre'>"+genre["name"]+"</a>";
			});
			htmlFeature += ", released on <a class='album' href='#'>"+song.albumName + "</a>, " + song.release_date+"</p><p class='trackInfo'>"+song.trackInfo+"</p></div></div>";
		}

	});
	htmlSongs += "</ul>";
	player.libraryContainer.append(htmlFeature+htmlHeader+htmlSongs);
}

function renderPlaylist(){
	var html = "<ul class='cf' id='playlistUl'></ul>";
	player.playlistContainer.append(html);
	setupScrollSlider();
}
function renderPlayer(){	
	var html = '<div id="player"><div class="cf seekBarContainer"><span class="songTime" id="startTime">0:00</span><div class="seekBar"></div><span class="songTime" id="endTime">0:00</span></div><div class="currentlyPlaying"><p><span class="songName"></span><span class="artist"></span></p></div><div id="controls"><a  href="#" class="playlist">'+playlistSVG+'</a><a href="#" class="volume">'+volumeSVG+'<div id="volumeContainer"><div id="volumeSlider"></div></div></a><a href="#" class="previous">'+prevSVG+'</a><a href="#" class="playPause">'+playSVG+'</a><a href="#" class="next">'+nextSVG+'</a></div></div>';

	player.playerContainer.append(html);
	player.isInitialized = true;
	player.el = player.playerContainer.find('#player');
	player.controls.el = player.playerContainer.find('#controls');
	player.controls.playPause = player.playerContainer.find('.playPause');
	player.controls.stop = player.playerContainer.find('.stop');
	player.controls.next = player.playerContainer.find('.next');
	player.controls.playlist = player.playerContainer.find('.playlist');
	player.controls.volumeSlider = player.playerContainer.find('#volumeSlider').slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 60,
	});
	player.controls.seekBar = player.playerContainer.find('.seekBar').slider({
		range: "min",
		value: 0,
		min: 1
	});
	player.controls.startTime = player.playerContainer.find('#startTime');
	player.controls.endTime = player.playerContainer.find('#endTime');
	player.currentlyPlayingArtistEl = player.playerContainer.find('.currentlyPlaying .artist');
	player.currentlyPlayingSongNameEl = player.playerContainer.find('.currentlyPlaying .songName');
	setListeners();
	setupSeekbar();
	setupVolumeSlider();
	bindPlayer();
}


function setupVolumeSlider(){
	var volumeSlider = player.controls.volumeSlider;
	volumeSlider.on('slide', function(event, ui){
		if(audio != null){
			console.log(ui.value);
			audio.volume = ui.value/100;
		}
	});
}
//sets up listeners on seekbar. only needs to happen once since seekbars are single instance.
function setupSeekbar(){
	seekBar = player.controls.seekBar;
	//stops seeking when use begins drag
	seekBar.on( "slidestart", function() {
		clearInterval(audio_clock);	
	});
	seekBar.on( "slidechange", function( event, ui ) {
		//track time change on seekbar
		player.controls.startTime.html(secondsToTime(ui.value/10));
	} );
	//resumes seeking when user ends drag
	seekBar.on( "slidestop", function( event, ui ) {
		
		value = seekBar.slider("value");
		player.audioElement.currentTime = value/10;
		if(player.getCurrentlyPlayingSong().isPlaying){
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
	player.playlistContainer.mCustomScrollbar({
		axis:"x",
		advanced:{
			autoExpandHorizontalScroll:true
		}
	});
}