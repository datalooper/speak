/** Define object models **/

var SpeakPlayer = SpeakPlayer || {};
SpeakPlayer.player = {
	playerContainer : $('#playerContainer'),
	libraryContainer : $('#libraryContainer'),
	playlistContainer : $('#playlistContainer'),
	currentlyPlayingArtistEl : '',
	currentlyPlayingSongNameEl : '',
	isPlaying : 'false',
	isInitialized : 'false',
	audioElement : '',
	el : '',
	controls : { 
		volumeSlider : '',
		el : '',
		playPause : '',
		seekBar : '',
		mute : '',
		stop : '',
		playlist : '',
		startTime : '',
		endTime : ''
	},
	songs : [],
	playlist : [],
	clearCurrentlyPlayingSong : function(){
		SpeakPlayer.player.audioElement.remove();
        SpeakPlayer.player.currentlyPlayingArtistEl.text('');
        SpeakPlayer.player.currentlyPlayingSongNameEl.text('');
	},
	setCurrentlyPlayingSong : function(song){
        SpeakPlayer.player.currentlyPlayingArtistEl.text(song.artistName);
        SpeakPlayer.player.currentlyPlayingSongNameEl.text(song.songName);
		song.isPlaying = true;
		song.isLoaded = true;

	},
	//gets currently playing song from playlist array
	getCurrentlyPlayingSong : function(){
		for (var i = player.playlist.length - 1; i >= 0; i--) {
			if(player.playlist[i].isLoaded == true){
				return player.playlist[i];
			}
		}
	},
	//gets a song object based on ID
	getSong : function(id){
		for (var i = player.songs.length - 1; i >= 0; i--) {
			if(player.songs[i].id == id){
				return player.songs[i];
			}
		}
	}
}

//defines song model
SpeakPlayer.Song = function(obj) {
	this.isFeatured = false;
	this.isPlaying = false,
	this.isLoaded = false,
	this.trackInfo = '',
	this.artistName = 'artist',
	this.albumName = 'album',
	this.songName = 'track',
	this.songUrl = '',
	this.releaseDate = '',
	this.albumArtUrl = '',
	this.id = '-1',
	this.genres = '',
	this.removeFromPlaylist = function(){ removeFromPlaylist(this); },
	this.addToPlaylist = function(playOrder){ addToPlaylist(this, playOrder); },
	this.play = function(){ playPlaylistItem(); }

	// IF AN OBJECT WAS PASSED THEN INITIALISE PROPERTIES FROM THAT OBJECT
	for (var prop in obj) this[prop] = obj[prop];
}