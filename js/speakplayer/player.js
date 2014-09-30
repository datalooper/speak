/** Click Bindings **/

function bindPlayer(){
	
	SpeakPlayer.player.libraryContainer.on("mouseenter", "li .playOptions", function(event) {
		$(this).transition({width: 'auto'}, 500, 'in-out');

	});
	SpeakPlayer.player.libraryContainer.on("mouseleave", "li .playOptions", function(event) {
		$(this).transition({width: '25'}, 500, 'in-out');

	});
	//click handler for song objects in library
	SpeakPlayer.player.libraryContainer.on( "click", "li .playNow" , function(event) {
		var el = $(this);

		if(player != null){
			song = SpeakPlayer.player.getSong(el.closest('li').attr("id"));
			song.addToPlaylist(PLAY_NOW);
		}
		return false;
	});

    SpeakPlayer.player.libraryContainer.on("click", "#search label", function(event){
        SpeakPlayer.player.libraryContainer.find('#input').toggleClass('focus');
    });
	SpeakPlayer.player.libraryContainer.on( "click", "li .playNext" , function(event) {
		var el = $(this);

		if(player != null){
			song = SpeakPlayer.player.getSong(el.closest('li').attr("id"));
			song.addToPlaylist(PLAY_NEXT);
		}
		return false;
	});

	SpeakPlayer.player.libraryContainer.on( "click", "li .addToPlaylist" , function(event) {
		var el = $(this);

		if(player != null){
			song = SpeakPlayer.player.getSong(el.closest('li').attr("id"));
			song.addToPlaylist(ADD_TO_PLAYLIST);
		}
		return false;
	});
	//remove item click handler
	SpeakPlayer.player.playlistContainer.on( "click",".remove", function() {	
		el = $(this).parent();
		song = SpeakPlayer.player.getSong(el.attr('id'));
		song.removeFromPlaylist();
		return false;
	});

	//play item click handler
	SpeakPlayer.player.playlistContainer.on( "click", ".playOverlay", function(e) {
		var el = $(this).closest('.song');
		song = SpeakPlayer.player.getSong(el.attr('id'));
		if(!song.isLoaded){
			changeSong(song);
		} else if(el.hasClass('playing')){
			SpeakPlayer.player.audioElement.pause();
			el.removeClass('playing');
		} else{
			SpeakPlayer.player.audioElement.play();
			el.addClass('playing');
		}
		e.stopPropagation();
		return false;
	});

	//pauses player
	SpeakPlayer.player.playerContainer.on("click",".playPause", function(){
		var button = $(this);
		if(button.hasClass('playing')){
			$('.song.playing').removeClass('playing');
			SpeakPlayer.player.audioElement.pause();
		} else{
			$('#'+SpeakPlayer.player.getCurrentlyPlayingSong().id).addClass('playing');
			SpeakPlayer.player.audioElement.play();
		}

	});

	SpeakPlayer.player.playerContainer.on("click",".playlist", function(){
		var wrap = $(".off-canvas-wrap");
		if(SpeakPlayer.player.playlistContainer.hasClass("active")){
			wrap.removeClass("playlistActive");
			SpeakPlayer.player.playlistContainer.removeClass("active");
		} else{
			SpeakPlayer.player.playlistContainer.addClass("active");
			wrap.addClass("playlistActive");

		}
	});

	//pauses player
	SpeakPlayer.player.playerContainer.on("click",".previous", function(){
		seekPreviousSong();
	});

	//pauses player
	SpeakPlayer.player.playerContainer.on("click",".next", function(){
		seekNextSong();
	});
}



/** Library Item Functionality **/
PLAY_NOW = 1;
PLAY_NEXT = 2;
ADD_TO_PLAYLIST = 3;

function addToPlaylist(song, playOrder){
	//display playlist object on screen
	SpeakPlayer.player.playerContainer.show();
	var playerUl = SpeakPlayer.player.playlistContainer.find('ul');
	var htmlPlaying = "<li id='"+song.id+"' class='playing current song'>";
	var htmlNoPlay = "<li id='"+song.id+"' class='song'>";
	var html = "<img src='"+song.albumArtUrl+"'/><div class='songInfo'><p class='songName'>"+ song.songName +
	"</p><p class='artistName'>"+song.artistName+"</p></div><div class='playOverlay'><a href='#' class='play'>"+playSVG+"</a><a href='#' class='pause'>"+pauseSVG+"</a></div><a href='#' class='remove'></li>";

	if(SpeakPlayer.player.playlistContainer.find('#'+song.id).length > 0){
		return false;
	} else if(jQuery.isEmptyObject(SpeakPlayer.player.playlist) || playOrder == PLAY_NOW){
		playerUl.prepend(htmlPlaying+html);
		changeSong(song);
		SpeakPlayer.player.libraryContainer.addClass('playing');
		playerUl.sortable().disableSelection();
	}else if(playOrder == ADD_TO_PLAYLIST) {
		playerUl.append(htmlNoPlay+html);
	} else{
		playerUl.find('.current').after(htmlNoPlay+html);
	}
	SpeakPlayer.player.playlist.push(song);	

}



/** Global Controls **/

function setPlayPauseButton(isPlaying){
	if(isPlaying){
		SpeakPlayer.player.controls.playPause.addClass('playing');
		SpeakPlayer.player.controls.playPause.html(pauseSVG);
	} else{
		SpeakPlayer.player.controls.playPause.removeClass('playing');
		SpeakPlayer.player.controls.playPause.html(playSVG);
	}
}





//begins playing specified song and removes current song.
function changeSong(song) {

	//removes current playing song
	if(SpeakPlayer.player.audioElement){
		SpeakPlayer.player.audioElement.pause();
		SpeakPlayer.player.audioElement.remove();
	}
	//instantiate new audio element
	audio = SpeakPlayer.player.audioElement = new Audio(song.songUrl);
	audio.addEventListener("loadedmetadata", function(_event) {
		var duration = audio.duration;
		initAnalyzer(audio);
		SpeakPlayer.player.controls.endTime.html(secondsToTime(duration));
			    //TODO whatever
			});
	//resets playing flag on previously playing song in playlist array.
	if(SpeakPlayer.player.getCurrentlyPlayingSong()){
		SpeakPlayer.player.getCurrentlyPlayingSong().isPlaying = false;
		SpeakPlayer.player.getCurrentlyPlayingSong().isLoaded = false;
	}
	//adds playing class to library and playlist items
	$('.song').removeClass('playing current');
	$('.song#' + song.id).each(function(){
		$(this).addClass('playing current');
	});
	SpeakPlayer.player.setCurrentlyPlayingSong(song);
	SpeakPlayer.player.isPlaying = true;
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
		prevSongId = SpeakPlayer.player.playlistContainer.find('#' + endingSong.id).prev('li').attr('id');
		return SpeakPlayer.player.getSong(prevSongId)
	} else{
		return false;
	}
}

function endSong(){
	endingSong = SpeakPlayer.player.getCurrentlyPlayingSong();
	if(typeof(endingSong) !== "undefined"){
		return endingSong;
	} else{
		return false;
	}
	
}

function getNextSong(){
	var endingSong = endSong();
	if(endingSong){
		nextSongId = SpeakPlayer.player.playlistContainer.find('#' + endingSong.id).next('li').attr('id');
		return SpeakPlayer.player.getSong(nextSongId);
	} else{
		return false;
	}
}

function seekNextSong(){
	var nextSong = getNextSong();
	if(nextSong){		
		SpeakPlayer.player.clearCurrentlyPlayingSong();
		changeSong(nextSong);
	}
}
function seekPreviousSong(){
	var prevSong = getPreviousSong();
	if(prevSong){
		SpeakPlayer.player.clearCurrentlyPlayingSong();
		changeSong(prevSong);
	}
}



