/**
 * Created by vcimo5 on 9/30/14.
 * This is the meat of the player, housing the controls.
 * Set up as a singleton, as there should only be one instance of the player.
 */
SpeakPlayer.Player = {
    playerContainer: $('#playerContainer'),
    currentlyPlayingArtistEl: '',
    currentlyPlayingSongNameEl: '',
    isPlaying: 'false',
    isInitialized: 'false',
    audioElement: '',
    el: '',
    controls: {
        volumeSlider: '',
        el: '',
        playPause: '',
        seekBar: '',
        mute: '',
        stop: '',
        playlist: '',
        startTime: '',
        endTime: ''
    },
    songs: [],
    PLAY_NOW : 1,
    PLAY_NEXT : 2,
    ADD_TO_PLAYLIST : 3,

    /* Initially Renders Player */
    render: function (playerContainer) {
        this.playerContainer = playerContainer;
        var html = '<div id="player"><div class="cf seekBarContainer"><span class="songTime" id="startTime">0:00</span><div class="seekBar"></div><span class="songTime" id="endTime">0:00</span></div><div class="currentlyPlaying"><p><span class="songName"></span><span class="artist"></span></p></div><div id="controls"><a  href="#" class="playlist">' + playlistSVG + '</a><a href="#" class="volume">' + volumeSVG + '<div id="volumeContainer"><div id="volumeSlider"></div></div></a><a href="#" class="previous">' + prevSVG + '</a><a href="#" class="playPause">' + playSVG + '</a><a href="#" class="next">' + nextSVG + '</a></div></div>';
        this.playerContainer.append(html);
        this.isInitialized = true;
        this.el = this.playerContainer.find('#player');

        this.currentlyPlayingArtistEl = this.playerContainer.find('.currentlyPlaying .artist');
        this.currentlyPlayingSongNameEl = this.playerContainer.find('.currentlyPlaying .songName');


        this.initControls();
        this.setListeners();
        this.bindPlayer();

        SpeakPlayer.Seekbar.init();
        SpeakPlayer.Volumeslider.init();


    },
    /* Sets Up Player Controls */
    initControls : function(){
        this.controls.el = this.playerContainer.find('#controls');
        this.controls.playPause = this.playerContainer.find('.playPause');
        this.controls.stop = this.playerContainer.find('.stop');
        this.controls.next = this.playerContainer.find('.next');
        this.controls.playlist = this.playerContainer.find('.playlist');
        this.controls.volumeSlider = this.playerContainer.find('#volumeSlider').slider({
            orientation: "vertical",
            range: "min",
            min: 0,
            max: 100,
            value: 60
        });
        this.controls.seekBar = this.playerContainer.find('.seekBar').slider({
            range: "min",
            value: 0,
            min: 1
        });
        this.controls.startTime = this.playerContainer.find('#startTime');
        this.controls.endTime = this.playerContainer.find('#endTime');
    },


    bindPlayer: function () {

        //click handler for song objects in library
        SpeakPlayer.Library.libraryContainer.on("click", "li .playNow", function (event) {
            var el = $(this);

            if (player != null) {
                song = SpeakPlayer.Player.getSong(el.closest('li').data("song-id"));
                SpeakPlayer.Playlist.addToPlaylist(song, SpeakPlayer.Player.PLAY_NOW);
            }
            return false;
        });

        SpeakPlayer.Library.libraryContainer.on("click", "#search label", function (event) {
            SpeakPlayer.Library.libraryContainer.find('#input').toggleClass('focus');
        });
        SpeakPlayer.Library.libraryContainer.on("click", "li .playNext", function (event) {
            var el = $(this);

            if (player != null) {
                song = SpeakPlayer.Player.getSong(el.closest('li').data("song-id"));
                SpeakPlayer.Playlist.addToPlaylist(song, SpeakPlayer.Player.PLAY_NEXT);
            }
            return false;
        });

        SpeakPlayer.Library.libraryContainer.on("click", "li .addToPlaylist", function (event) {
            var el = $(this);

            if (player != null) {
                song = SpeakPlayer.Player.getSong(el.closest('li').data("song-id"));
                SpeakPlayer.Playlist.addToPlaylist(song, SpeakPlayer.Player.ADD_TO_PLAYLIST);
            }
            return false;
        });
        //remove item click handler
        SpeakPlayer.Playlist.playlistContainer.on("click", ".remove", function () {
            el = $(this).parent();
            var song = SpeakPlayer.Player.getSong(el.attr('id'));
            SpeakPlayer.Playlist.removeFromPlaylist(song);
            return false;
        });

        //play item click handler
        SpeakPlayer.Playlist.playlistContainer.on("click", ".playOverlay", function (e) {
            var el = $(this).closest('.song');
            song = SpeakPlayer.Player.getSong(el.data('song-id'));
            if (!song.isLoaded) {
                SpeakPlayer.Player.changeSong(song);
            } else if (el.hasClass('playing')) {
                SpeakPlayer.Player.audioElement.pause();
                el.removeClass('playing');
            } else {
                SpeakPlayer.Player.audioElement.play();
                el.addClass('playing');
            }
            e.stopPropagation();
            return false;
        });

        //pauses player
        SpeakPlayer.Player.playerContainer.on("click", ".playPause", function () {
            var button = $(this);
            if (button.hasClass('playing')) {
                $('.song.playing').removeClass('playing');
                SpeakPlayer.Player.audioElement.pause();
            } else {
                $('#' + SpeakPlayer.Player.getCurrentlyPlayingSong().id).addClass('playing');
                SpeakPlayer.Player.audioElement.play();
            }

        });

        SpeakPlayer.Player.playerContainer.on("click", ".playlist", function () {
            var wrap = $(".off-canvas-wrap");
            if (SpeakPlayer.Playlist.playlistContainer.hasClass("active")) {
                wrap.removeClass("playlistActive");
                SpeakPlayer.Playlist.playlistContainer.removeClass("active");
            } else {
                SpeakPlayer.Playlist.playlistContainer.addClass("active");
                wrap.addClass("playlistActive");

            }
        });

        //pauses player
        SpeakPlayer.Player.playerContainer.on("click", ".previous", function () {
            SpeakPlayer.Player.seekPreviousSong();
        });

        //pauses player
        SpeakPlayer.Player.playerContainer.on("click", ".next", function () {
            SpeakPlayer.Player.seekNextSong();
        });
    },

    setListeners: function () {
        if (SpeakPlayer.Player.audioElement) {
            var userSlideStarted = false,
                seekBar = SpeakPlayer.Player.controls.seekBar,
                audioEl = SpeakPlayer.Player.audioElement;

            //waits until metadata is loaded to scale seekBar to track duration
            audioEl.addEventListener('loadedmetadata', function () {
                seekBar.slider("option", "max", audioEl.duration * 10);
                value = 0;
                if (typeof(audio_clock) === "undefined" || audio_clock == null) {
                    audio_clock = SpeakPlayer.Seekbar.startSeeking();
                }
            });

            audioEl.addEventListener("pause", function () {
                song.isPlaying = false;
                if (SpeakPlayer.Player.controls.playPause.hasClass('playing')) {
                    SpeakPlayer.Player.setPlayPauseButton(false);
                    if (SpeakPlayer.Player.getCurrentlyPlayingSong()) {
                        SpeakPlayer.Player.getCurrentlyPlayingSong().isPlaying = false;
                    }
                }
                clearInterval(audio_clock);
            });
            //listens to end of song and queues up the next in the list.
            //currently, this queries the DOM and checks for the next element.
            //in would probably be better to internally maintain the order of the playlist, but...later.
            audioEl.addEventListener('ended', function () {
                SpeakPlayer.Playlist.removeFromPlaylist(SpeakPlayer.Player.getCurrentlyPlayingSong());
            });
            audioEl.addEventListener("play", function () {
                song.isPlaying = true;
                if (!SpeakPlayer.Player.controls.playPause.hasClass('playing')) {
                    SpeakPlayer.Player.setPlayPauseButton(true);
                }
                //clears previous seekbar intervals
                if (typeof(audio_clock) !== "undefined") {
                    clearInterval(audio_clock);
                    audio_clock = null;
                }
                audio_clock = SpeakPlayer.Seekbar.startSeeking();
            });
        }
    },
    stopSong: function () {
        if (audio_clock !== "undefined" && audio_clock != null) {
            clearInterval(audio_clock);
            SpeakPlayer.Player.controls.seekBar.slider("value", 0);
        }
        SpeakPlayer.Player.audioElement.pause();
        SpeakPlayer.Player.audioElement.remove();
        song.isLoaded = false;
        song.isPlaying = false;
    },
    clearCurrentlyPlayingSong: function () {
        this.audioElement.remove();
        this.currentlyPlayingArtistEl.text('');
        this.currentlyPlayingSongNameEl.text('');
    },
    setCurrentlyPlayingSong: function (song) {
        this.currentlyPlayingArtistEl.text(song.artistName);
        this.currentlyPlayingSongNameEl.text(song.songName);
        song.isPlaying = true;
        song.isLoaded = true;

    },
    //gets currently playing song from playlist array
    getCurrentlyPlayingSong: function () {
        for (var i = SpeakPlayer.Playlist.playlist.length - 1; i >= 0; i--) {
            if (SpeakPlayer.Playlist.playlist[i].isLoaded == true) {
                return SpeakPlayer.Playlist.playlist[i];
            }
        }
    },
    //gets a song object based on ID
    getSong: function (id) {
        for (var i = this.songs.length - 1; i >= 0; i--) {
            if (this.songs[i].id == id) {
                return this.songs[i];
            }
        }
    },
    setPlayPauseButton: function (isPlaying) {
        if (isPlaying) {
            this.controls.playPause.addClass('playing');
            this.controls.playPause.html(pauseSVG);
        } else {
            this.controls.playPause.removeClass('playing');
            this.controls.playPause.html(playSVG);
        }
    },


    getPreviousSong: function () {
        var endingSong = this.endSong();
        if (endingSong) {
            prevSongId = SpeakPlayer.Playlist.playlistContainer.find('[data-song-id=' + endingSong.id + ']').prev('li').data('song-id');
            return this.getSong(prevSongId)
        } else {
            return false;
        }
    },

    endSong: function () {
        endingSong = this.getCurrentlyPlayingSong();
        if (typeof(endingSong) !== "undefined") {
            return endingSong;
        } else {
            return false;
        }

    },

    getNextSong: function () {
        var endingSong = this.endSong();
        if (endingSong) {
            nextSongId = SpeakPlayer.Playlist.playlistContainer.find('[data-song-id=' + endingSong.id + ']').next('li').data('song-id');
            return this.getSong(nextSongId);
        } else {
            return false;
        }
    },

    seekNextSong: function () {
        var nextSong = this.getNextSong();
        if (nextSong) {
            this.clearCurrentlyPlayingSong();
            this.changeSong(nextSong);
        }
    },
    seekPreviousSong: function () {
        var prevSong = this.getPreviousSong();
        if (prevSong) {
            this.clearCurrentlyPlayingSong();
            this.changeSong(prevSong);
        }
    },
    //begins playing specified song and removes current song.
    changeSong: function (song) {

        //removes current playing song
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.remove();
        }
        //instantiate new audio element
        audio = this.audioElement = new Audio(song.songUrl);
        audio.addEventListener("loadedmetadata", function (_event) {
            var duration = audio.duration;
            //SpeakPlayer.Visualizer.initAnalyzer(audio);
            SpeakPlayer.Player.controls.endTime.html(SpeakPlayer.Seekbar.secondsToTime(duration));
        });
        //resets playing flag on previously playing song in playlist array.
        if (SpeakPlayer.Player.getCurrentlyPlayingSong()) {
            SpeakPlayer.Player.getCurrentlyPlayingSong().isPlaying = false;
            SpeakPlayer.Player.getCurrentlyPlayingSong().isLoaded = false;
        }
        //adds playing class to library and playlist items
        $('.song').removeClass('playing current');
        $('.song[data-song-id=' + song.id + ']').each(function () {
            $(this).addClass('playing current');
        });
        SpeakPlayer.Library.renderFeature(song);
        SpeakPlayer.Player.setCurrentlyPlayingSong(song);
        SpeakPlayer.Player.isPlaying = true;
        /****************/
        audio.volume = 1.0;		//remove soon
        audio.pause();
        audio.load(); //suspends and restores all audio element
        audio.play();

        //sets up seekbar and song ended listeners. only called once since seekbar is single instance
        this.setListeners();

        /****************/
    }
};