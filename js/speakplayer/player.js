/** Click Bindings **/

function bindPlayer(){
	
	player.libraryContainer.on("mouseenter", "li .playOptions", function(event) {
		$(this).transition({width: 'auto'}, 500, 'in-out');

	});
	player.libraryContainer.on("mouseleave", "li .playOptions", function(event) {
		$(this).transition({width: '25'}, 500, 'in-out');

	});
	//click handler for song objects in library
	player.libraryContainer.on( "click", "li .playNow" , function(event) {
		var el = $(this);

		if(player != null){
			song = player.getSong(el.closest('li').attr("id"));
			song.addToPlaylist(PLAY_NOW);
		}
		return false;
	});

	player.libraryContainer.on( "click", "li .playNext" , function(event) {
		var el = $(this);

		if(player != null){
			song = player.getSong(el.closest('li').attr("id"));
			song.addToPlaylist(PLAY_NEXT);
		}
		return false;
	});

	player.libraryContainer.on( "click", "li .addToPlaylist" , function(event) {
		var el = $(this);

		if(player != null){
			song = player.getSong(el.closest('li').attr("id"));
			song.addToPlaylist(ADD_TO_PLAYLIST);
		}
		return false;
	});
	//remove item click handler
	player.playlistContainer.on( "click",".remove", function() {	
		el = $(this).parent();
		song = player.getSong(el.attr('id'));
		song.removeFromPlaylist();
		return false;
	});

	//play item click handler
	player.playlistContainer.on( "click", ".playOverlay", function(e) {
		var el = $(this).closest('.song');
		song = player.getSong(el.attr('id'));
		if(!song.isLoaded){
			changeSong(song);
		} else if(el.hasClass('playing')){
			player.audioElement.pause();
			el.removeClass('playing');
		} else{
			player.audioElement.play();
			el.addClass('playing');
		}
		e.stopPropagation();
		return false;
	});

	//pauses player
	player.playerContainer.on("click",".playPause", function(){
		var button = $(this);
		if(button.hasClass('playing')){
			$('.song.playing').removeClass('playing');
			player.audioElement.pause();
		} else{
			$('#'+player.getCurrentlyPlayingSong().id).addClass('playing');
			player.audioElement.play();
		}

	});

	player.playerContainer.on("click",".playlist", function(){
		var wrap = $(".off-canvas-wrap");
		if(player.playlistContainer.hasClass("active")){
			wrap.removeClass("playlistActive");
			player.playlistContainer.removeClass("active");
		} else{
			player.playlistContainer.addClass("active");
			wrap.addClass("playlistActive");

		}
	});

	//pauses player
	player.playerContainer.on("click",".previous", function(){
		seekPreviousSong();
	});

	//pauses player
	player.playerContainer.on("click",".next", function(){
		seekNextSong();
	});
}



/** Library Item Functionality **/
PLAY_NOW = 1;
PLAY_NEXT = 2;
ADD_TO_PLAYLIST = 3;

function addToPlaylist(song, playOrder){
	//display playlist object on screen
	player.playerContainer.show();
	var playerUl = player.playlistContainer.find('ul');
	var htmlPlaying = "<li id='"+song.id+"' class='playing current song'>";
	var htmlNoPlay = "<li id='"+song.id+"' class='song'>";
	var html = "<img src='"+song.albumArtUrl+"'/><div class='songInfo'><p class='songName'>"+ song.songName +
	"</p><p class='artistName'>"+song.artistName+"</p></div><div class='playOverlay'><a href='#' class='play'>"+playSVG+"</a><a href='#' class='pause'>"+pauseSVG+"</a></div><a href='#' class='remove'></li>";

	if(player.playlistContainer.find('#'+song.id).length > 0){
		return false;
	} else if(jQuery.isEmptyObject(player.playlist) || playOrder == PLAY_NOW){
		playerUl.prepend(htmlPlaying+html);
		changeSong(song);
		player.libraryContainer.addClass('playing');
		playerUl.sortable().disableSelection();
	}else if(playOrder == ADD_TO_PLAYLIST) {
		playerUl.append(htmlNoPlay+html);
	} else{
		playerUl.find('.current').after(htmlNoPlay+html);
	}
	player.playlist.push(song);	

}



/** Global Controls **/

function setPlayPauseButton(isPlaying){
	if(isPlaying){
		player.controls.playPause.addClass('playing');
		player.controls.playPause.html(pauseSVG);
	} else{
		player.controls.playPause.removeClass('playing');
		player.controls.playPause.html(playSVG);
	}
}





//begins playing specified song and removes current song.
function changeSong(song) {

	//removes current playing song
	if(player.audioElement){
		player.audioElement.pause();
		player.audioElement.remove();
	}
	//instantiate new audio element
	audio = player.audioElement = new Audio(song.songUrl);
	audio.addEventListener("loadedmetadata", function(_event) {
		var duration = audio.duration;
		initAnalyzer(audio);
		player.controls.endTime.html(secondsToTime(duration));
			    //TODO whatever
			});
	//resets playing flag on previously playing song in playlist array.
	if(player.getCurrentlyPlayingSong()){
		player.getCurrentlyPlayingSong().isPlaying = false;
		player.getCurrentlyPlayingSong().isLoaded = false;
	}
	//adds playing class to library and playlist items
	$('.song').removeClass('playing current');
	$('.song#' + song.id).each(function(){
		$(this).addClass('playing current');
	});
	player.setCurrentlyPlayingSong(song);
	player.isPlaying = true;
	/****************/
    audio.volume = 1.0;		//remove soon
    audio.pause();
    audio.load(); //suspends and restores all audio element
    audio.play();

    //sets up seekbar and song ended listeners. only called once since seekbar is single instance
    setListeners();
    
    /****************/
}

function getPreviousSong(){
	var endingSong = endSong();
	if(endingSong){
		prevSongId = player.playlistContainer.find('#' + endingSong.id).prev('li').attr('id');
		return player.getSong(prevSongId)
	} else{
		return false;
	}
}

function endSong(){
	endingSong = player.getCurrentlyPlayingSong();
	if(typeof(endingSong) !== "undefined"){
		return endingSong;
	} else{
		return false;
	}
	
}

function getNextSong(){
	var endingSong = endSong();
	if(endingSong){
		nextSongId = player.playlistContainer.find('#' + endingSong.id).next('li').attr('id');
		return player.getSong(nextSongId);
	} else{
		return false;
	}
}

function seekNextSong(){
	var nextSong = getNextSong();
	if(nextSong){		
		player.clearCurrentlyPlayingSong();
		changeSong(nextSong);
	}
}
function seekPreviousSong(){
	var prevSong = getPreviousSong();
	if(prevSong){
		player.clearCurrentlyPlayingSong();
		changeSong(prevSong);
	}
}



