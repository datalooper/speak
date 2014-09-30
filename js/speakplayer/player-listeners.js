function setListeners(){
	if(player.audioElement){
		var userSlideStarted = false, 
		seekBar = player.controls.seekBar,
		audioEl = player.audioElement;

		//waits until metadata is loaded to scale seekBar to track duration
		audioEl.addEventListener('loadedmetadata', function(){
			seekBar.slider( "option", "max" , audioEl.duration * 10  );
			value = 0;
			if(typeof(audio_clock) === "undefined" || audio_clock == null){
				audio_clock = startSeeking();
			}
		});
		
		audioEl.addEventListener("pause", function(){
			song.isPlaying = false;
			if(player.controls.playPause.hasClass('playing')){
				setPlayPauseButton(false);
				if(player.getCurrentlyPlayingSong()){
					player.getCurrentlyPlayingSong().isPlaying = false;
				}
			}
			clearInterval(audio_clock);
		});
		//listens to end of song and queues up the next in the list.
		//currently, this queries the DOM and checks for the next element.
		//in would probably be better to internally maintain the order of the playlist, but...later.
		audioEl.addEventListener('ended', function(){
			removeFromPlaylist(player.getCurrentlyPlayingSong());
		});
		audioEl.addEventListener("play", function(){
			song.isPlaying = true;
			if(!player.controls.playPause.hasClass('playing')){
				setPlayPauseButton(true);
			}
			//clears previous seekbar intervals
			if(typeof(audio_clock) !== "undefined"){
				clearInterval(audio_clock);
				audio_clock = null;
			}
			audio_clock = startSeeking();
		});
	}
}

//begins seeking. We avoid using the player callbacks, because they only execute every 250ms, 
//making the seekBar seem grainy.
function startSeeking(){
	return setInterval(function(){
		value += 1;
		player.controls.seekBar.slider("value", value);

	}, 100);
}