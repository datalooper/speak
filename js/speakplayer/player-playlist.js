/** Playlist Object Controls **/



//removes element from playlist by recreating array
function removeFromPlaylist(song){

	if(song == player.getCurrentlyPlayingSong()){
		var nextSong = getNextSong();
		stopSong();
		player.clearCurrentlyPlayingSong();
		if(nextSong != null){
			changeSong(nextSong);
		}
	}
	$('#'+song.id).remove();

	player.playlist = jQuery.grep(player.playlist, function(value){
		return value != song;
	});
}

function stopSong(){
	if(audio_clock !== "undefined" && audio_clock != null){
		clearInterval(audio_clock);
		player.controls.seekBar.slider("value", 0);
	}
	player.audioElement.pause();
	player.audioElement.remove();
	song.isLoaded = false;
	song.isPlaying = false;
}
