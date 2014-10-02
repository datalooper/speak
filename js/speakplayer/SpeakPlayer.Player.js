/**
 * Created by vcimo5 on 9/30/14.
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

    render: function (playerContainer) {
        this.playerContainer = playerContainer;
        var html = '<div id="player"><div class="cf seekBarContainer"><span class="songTime" id="startTime">0:00</span><div class="seekBar"></div><span class="songTime" id="endTime">0:00</span></div><div class="currentlyPlaying"><p><span class="songName"></span><span class="artist"></span></p></div><div id="controls"><a  href="#" class="playlist">' + playlistSVG + '</a><a href="#" class="volume">' + volumeSVG + '<div id="volumeContainer"><div id="volumeSlider"></div></div></a><a href="#" class="previous">' + prevSVG + '</a><a href="#" class="playPause">' + playSVG + '</a><a href="#" class="next">' + nextSVG + '</a></div></div>';
        this.playerContainer.append(html);
        this.isInitialized = true;
        this.el = this.playerContainer.find('#player');
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
        this.currentlyPlayingArtistEl = this.playerContainer.find('.currentlyPlaying .artist');
        this.currentlyPlayingSongNameEl = this.playerContainer.find('.currentlyPlaying .songName');

        SpeakPlayer.Seekbar.init();
        SpeakPlayer.Volumeslider.init()
        this.setListeners();
        this.bindPlayer();

    },
    bindPlayer: function () {

        SpeakPlayer.Library.libraryContainer.on("mouseenter", "li .playOptions", function (event) {
            $(this).transition({width: 'auto'}, 500, 'in-out');

        });
        SpeakPlayer.Library.libraryContainer.on("mouseleave", "li .playOptions", function (event) {
            $(this).transition({width: '25'}, 500, 'in-out');

        });
        //click handler for song objects in library
        SpeakPlayer.Library.libraryContainer.on("click", "li .playNow", function (event) {
            var el = $(this);

            if (player != null) {
                song = SpeakPlayer.Player.getSong(el.closest('li').attr("id"));
                SpeakPlayer.Playlist.addToPlaylist(song, this.PLAY_NOW);
            }
            return false;
        });

        SpeakPlayer.Library.libraryContainer.on("click", "#search label", function (event) {
            SpeakPlayer.Library.libraryContainer.find('#input').toggleClass('focus');
        });
        SpeakPlayer.Library.libraryContainer.on("click", "li .playNext", function (event) {
            var el = $(this);

            if (player != null) {
                song = SpeakPlayer.Player.getSong(el.closest('li').attr("id"));
                SpeakPlayer.Playlist.addToPlaylist(song, this.PLAY_NEXT);
            }
            return false;
        });

        SpeakPlayer.Library.libraryContainer.on("click", "li .addToPlaylist", function (event) {
            var el = $(this);

            if (player != null) {
                song = SpeakPlayer.Player.getSong(el.closest('li').attr("id"));
                SpeakPlayer.Playlist.addToPlaylist(song, this.ADD_TO_PLAYLIST);
            }
            return false;
        });
        //remove item click handler
        SpeakPlayer.Playlist.playlistContainer.on("click", ".remove", function () {
            el = $(this).parent();
            song = SpeakPlayer.Player.getSong(el.attr('id'));
            SpeakPlayer.Playlist.removeFromPlaylist();
            return false;
        });

        //play item click handler
        SpeakPlayer.Playlist.playlistContainer.on("click", ".playOverlay", function (e) {
            var el = $(this).closest('.song');
            song = SpeakPlayer.Player.getSong(el.attr('id'));
            if (!song.isLoaded) {
                this.changeSong(song);
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
            seekPreviousSong();
        });

        //pauses player
        SpeakPlayer.Player.playerContainer.on("click", ".next", function () {
            seekNextSong();
        });
    },

    setListeners: function () {
        if (player.audioElement) {
            var userSlideStarted = false,
                seekBar = player.controls.seekBar,
                audioEl = player.audioElement;

            //waits until metadata is loaded to scale seekBar to track duration
            audioEl.addEventListener('loadedmetadata', function () {
                seekBar.slider("option", "max", audioEl.duration * 10);
                value = 0;
                if (typeof(audio_clock) === "undefined" || audio_clock == null) {
                    audio_clock = startSeeking();
                }
            });

            audioEl.addEventListener("pause", function () {
                song.isPlaying = false;
                if (player.controls.playPause.hasClass('playing')) {
                    setPlayPauseButton(false);
                    if (player.getCurrentlyPlayingSong()) {
                        player.getCurrentlyPlayingSong().isPlaying = false;
                    }
                }
                clearInterval(audio_clock);
            });
            //listens to end of song and queues up the next in the list.
            //currently, this queries the DOM and checks for the next element.
            //in would probably be better to internally maintain the order of the playlist, but...later.
            audioEl.addEventListener('ended', function () {
                removeFromPlaylist(player.getCurrentlyPlayingSong());
            });
            audioEl.addEventListener("play", function () {
                song.isPlaying = true;
                if (!player.controls.playPause.hasClass('playing')) {
                    setPlayPauseButton(true);
                }
                //clears previous seekbar intervals
                if (typeof(audio_clock) !== "undefined") {
                    clearInterval(audio_clock);
                    audio_clock = null;
                }
                audio_clock = startSeeking();
            });
        }
    },
    stopSong: function () {
        if (audio_clock !== "undefined" && audio_clock != null) {
            clearInterval(audio_clock);
            player.controls.seekBar.slider("value", 0);
        }
        player.audioElement.pause();
        player.audioElement.remove();
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
                return player.playlist[i];
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
        var endingSong = endSong();
        if (endingSong) {
            prevSongId = this.playlistContainer.find('#' + endingSong.id).prev('li').attr('id');
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
        var endingSong = endSong();
        if (endingSong) {
            nextSongId = this.playlistContainer.find('#' + endingSong.id).next('li').attr('id');
            return this.getSong(nextSongId);
        } else {
            return false;
        }
    },

    seekNextSong: function () {
        var nextSong = getNextSong();
        if (nextSong) {
            this.clearCurrentlyPlayingSong();
            this.changeSong(nextSong);
        }
    },
    seekPreviousSong: function () {
        var prevSong = getPreviousSong();
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
        $('.song#' + song.id).each(function () {
            $(this).addClass('playing current');
        });
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