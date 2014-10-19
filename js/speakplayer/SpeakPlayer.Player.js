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
    genreFilter: [],
    controls: {
        volumeSlider: '',
        el: '',
        playPause: '',
        seekBar: '',
        volume: '',
        stop: '',
        playlist: '',
        startTime: '',
        endTime: '',
        playlistHelper : ''
    },
    svgs : {
        prevSVG : '',
        nextSVG : '',
        volumeSVG : '',
        playSVG : '',
        pauseSVG : '',
        playlistSVG : '',
        expandSVG :''

    },
    genres:[],
    songs: [],
    PLAY_NOW : 1,
    PLAY_NEXT : 2,
    ADD_TO_PLAYLIST : 3,
    PREPEND_PLAYLIST : 4,
    /* Initially Renders Player */
    render: function (playerContainer) {
        this.playerContainer = playerContainer;
        this.defineSVG();
        var html = '<div id="player"><div class="cf seekBarContainer"><span class="songTime" id="startTime">0:00</span><div class="seekBar"></div><span class="songTime" id="endTime">0:00</span></div><div class="currentlyPlaying"><p><span class="songName"></span><span class="artist"></span></p></div><div id="controls"><a href="#" class="playlist">' + this.svgs.playlistSVG + '<div class="playlistHelper"></div></a><a href="#" class="volume">' + this.svgs.volumeSVG + '<div id="volumeContainer"><div id="volumeSlider"></div></div></a><a href="#" class="previous">' + this.svgs.prevSVG + '</a><a href="#" class="playPause">' + this.svgs.playSVG + '</a><a href="#" class="next">' + this.svgs.nextSVG + '</a></div></div>';
        this.playerContainer.append(html);
        this.isInitialized = true;
        this.el = this.playerContainer.find('#player');

        this.currentlyPlayingArtistEl = this.playerContainer.find('.currentlyPlaying .artist');
        this.currentlyPlayingSongNameEl = this.playerContainer.find('.currentlyPlaying .songName');

        this.initControls();
        this.setListeners();
        this.bindPlayer();
        //setup tooltips
        $( document ).tooltip({
            extraClass: "speakTooltip",
            position: {
                my: "center bottom",
                at: "center top"

            }
        });
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
        this.controls.volume = this.playerContainer.find('.volume');

            this.controls.volumeSlider = this.playerContainer.find('#volumeSlider').slider({
            orientation: "vertical",
            range: "min",
            min: 0,
            max: 100,
            value: 60
        });
        this.controls.seekBar = this.playerContainer.find('.seekBar');
        this.controls.startTime = this.playerContainer.find('#startTime');
        this.controls.endTime = this.playerContainer.find('#endTime');
        this.controls.playlistHelper = this.playerContainer.find('.playlistHelper');
        SpeakPlayer.Seekbar.init();
    },

    defineSVG: function () {
        this.svgs.prevSVG = Handlebars.templates['prevSVG.hbs']();
        console.log(this.svgs.prevSVG);
        this.svgs.nextSVG = Handlebars.templates['nextSVG.hbs']();
        this.svgs.volumeSVG = Handlebars.templates['volumeSVG.hbs']();
        this.svgs.playSVG = Handlebars.templates['playSVG.hbs']();
        this.svgs.pauseSVG = Handlebars.templates['pauseSVG.hbs']();
        this.svgs.playlistSVG = Handlebars.templates['playlistSVG.hbs']();
        this.svgs.expandSVG = Handlebars.templates['expandSVG.hbs']();

    },
    bindPlayer: function () {

        $(window).resize(function(){
            if(SpeakPlayer.isInitialized) {
                SpeakPlayer.Library.sizeLibraryContainer();
            }
        });
        SpeakPlayer.Library.libraryContainer.on("click", ".clearPlaylist", function (event) {
            SpeakPlayer.Playlist.playlist = [];
            SpeakPlayer.Player.clearCurrentlyPlayingSong();
            SpeakPlayer.Library.libraryContainer.find('.inPlaylist').removeClass('inPlaylist current');
            SpeakPlayer.Playlist.playlistContainer.find('ul').html('');
            return false;
        });
        SpeakPlayer.Library.libraryContainer.on("click", ".playAll", function (event) {
            var song = null, songs = SpeakPlayer.Library.libraryContainer.find('#songContainer .song'), len = songs.length;


            $(songs.get().reverse()).each(function(index, element){
                    song = SpeakPlayer.Player.getSong($(this).data('song-id'));
                    if (index == len - 1) {
                        SpeakPlayer.Playlist.addToPlaylist(song, SpeakPlayer.Player.PLAY_NOW);
                    } else {
                        SpeakPlayer.Playlist.addToPlaylist(song, SpeakPlayer.Player.PREPEND_PLAYLIST);
                    }
            });

            return false;
        });


        //click handler for song objects in library
        SpeakPlayer.Library.libraryContainer.on("click", "li .removeFromPlaylist", function (event) {
            var el = $(this);

            if (player != null) {
                song = SpeakPlayer.Player.getSong(el.closest('li').data("song-id"));
                SpeakPlayer.Playlist.removeFromPlaylist(song);
            }
            return false;
        });
        //remove item click handler
        SpeakPlayer.Library.libraryContainer.on("click", ".pause", function () {
            el = $(this).parent();
            var song = SpeakPlayer.Player.getSong(el.data('song-id'));
            SpeakPlayer.Player.audioElement.pause(song);
            return false;
        });
        SpeakPlayer.Library.libraryContainer.on("click", ".genreButton", function () {
            $(this).toggleClass('active');
            SpeakPlayer.Library.libraryContainer.find('.genres').toggleClass('active');
        });
        SpeakPlayer.Library.libraryContainer.on("click", ".genres a", function () {
            var genreFilter = $(this).text(), genreLink = $(this);

            if(genreFilter == "All"){
                SpeakPlayer.Player.genreFilter = [];
                SpeakPlayer.Library.list.filter();
                SpeakPlayer.Library.libraryContainer.find(".genres a.inactive").removeClass('inactive');
                return false;
            } else if(SpeakPlayer.Player.genreFilter.length == 0){
                SpeakPlayer.Library.libraryContainer.find(".genres a").not(this).addClass("inactive");
                genreLink.removeClass('inactive');
                SpeakPlayer.Player.genreFilter.push(genreFilter);
            } else if(genreLink.hasClass('inactive')){
                genreLink.removeClass('inactive');
                SpeakPlayer.Player.genreFilter.push(genreFilter);
            } else{
                genreLink.addClass('inactive')
                SpeakPlayer.Player.genreFilter = jQuery.grep(SpeakPlayer.Player.genreFilter, function(value) {
                    return value != genreFilter;
                });
            }
            SpeakPlayer.Library.list.filter(function(item) {
                return $.inArray(item.values().genre, SpeakPlayer.Player.genreFilter) > -1;
            });

            return false;
        });

        SpeakPlayer.Library.libraryContainer.on("click", ".filterLink", function () {
            var filterTerm = $(this).text();
            SpeakPlayer.Library.libraryContainer.find(".clearFilter").removeClass('hide');
            SpeakPlayer.Library.libraryContainer.find("input.search").val(filterTerm);
            SpeakPlayer.Library.list.search(filterTerm);
            return false;
        });

        //click handler for song objects in library
        SpeakPlayer.Library.libraryContainer.on("click",  ".playNow", function (event) {
            var el = $(this), song = SpeakPlayer.Player.getSong(el.closest('[data-song-id]').data("song-id")),
                playlistEl = SpeakPlayer.Playlist.playlistContainer.find('[data-song-id='+song.id+']');
            if(playlistEl.length > 0){
                if(playlistEl.hasClass('current')){
                    SpeakPlayer.Player.audioElement.play();
                } else{
                    SpeakPlayer.Player.changeSong(song);
                }
            } else {
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

        SpeakPlayer.Library.libraryContainer.on("click", "li.song", function (event) {
            var el = $(this);

            if (player != null) {
                song = SpeakPlayer.Player.getSong(el.closest('li').data("song-id"));
                SpeakPlayer.Playlist.addToPlaylist(song, SpeakPlayer.Player.PLAY_NOW);
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
            var song = SpeakPlayer.Player.getSong(el.data('song-id'));
            SpeakPlayer.Playlist.removeFromPlaylist(song);
            return false;
        });

        //like item click handler
        SpeakPlayer.Library.libraryContainer.on("click", ".likeTrack", function () {
            var songId = $(this).closest('li').data('song-id'),
                songLink = 'http://www.facebook.com/sharer.php?u='+window.location.origin+'/sounds/'+songId;
            console.log(songLink);
            window.open(songLink,'','width=657,height=400,scrollbars=1');
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

            if(SpeakPlayer.Player.audioElement != null) {
                if (button.hasClass('playing')) {
                    SpeakPlayer.Player.audioElement.pause();
                } else {
                    SpeakPlayer.Player.audioElement.play();
                }
            }

        });
        SpeakPlayer.Library.libraryContainer.on("keyup",".search", function() {
            if($(this).val() == ""){
                SpeakPlayer.Library.libraryContainer.find('.clearFilter').addClass('hide');
            } else{
                SpeakPlayer.Library.libraryContainer.find('.clearFilter').removeClass('hide');
            }
        });
        SpeakPlayer.Library.libraryContainer.on("click",".clearFilter", function(){
            $(this).addClass('hide');
            SpeakPlayer.Library.libraryContainer.find('.search').val('');
            SpeakPlayer.Library.list.search();
        });
                SpeakPlayer.Player.playerContainer.on("click",".volume svg", function(){
            if(SpeakPlayer.Player.controls.volume.hasClass('muted')) {
                SpeakPlayer.Player.audioElement.volume = SpeakPlayer.Volumeslider.prevVolume/100;
                SpeakPlayer.Volumeslider.volumeSlider.slider("value", SpeakPlayer.Volumeslider.prevVolume);
                SpeakPlayer.Volumeslider.volumeSlider.slider("enable");
                SpeakPlayer.Player.controls.volume.removeClass('muted');

            }else{
                SpeakPlayer.Volumeslider.prevVolume = SpeakPlayer.Volumeslider.volumeSlider.slider("value");
                SpeakPlayer.Volumeslider.volumeSlider.slider("value", 0);
                SpeakPlayer.Player.audioElement.volume = 0;
                SpeakPlayer.Volumeslider.volumeSlider.slider("disable");

                SpeakPlayer.Player.controls.volume.addClass('muted');
            }
        });

        SpeakPlayer.Player.playerContainer.on("mouseleave",".volume", function() {
            var volumeContainer = SpeakPlayer.Player.controls.volume.find("#volumeContainer");
            volumeContainer.show();
            setTimeout(function(){
                volumeContainer.css('display','');
            }, 500);
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
            SpeakPlayer.Library.sizeLibraryContainer();

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
        if (this.audioElement) {
            //waits until metadata is loaded to scale seekBar to track duration
            this.audioElement.addEventListener('loadedmetadata', function () {
                SpeakPlayer.Seekbar.seekBar.slider("option", "max", SpeakPlayer.Player.audioElement.duration * 10);
                value = 0;
                if (typeof(SpeakPlayer.Seekbar.audio_clock) === "undefined" || SpeakPlayer.Seekbar.audio_clock == '') {
                    SpeakPlayer.Seekbar.startSeeking();
                }
            });

            this.audioElement.addEventListener("pause", function () {
                if(SpeakPlayer.Playlist.playlist.length > 0){
                    SpeakPlayer.Player.getCurrentlyPlayingSong().isPlaying = false;
                }
                $('.song.playing').removeClass('playing');
                if (SpeakPlayer.Player.controls.playPause.hasClass('playing')) {
                    SpeakPlayer.Player.setPlayPauseButton(false);
                }
                clearInterval(SpeakPlayer.Seekbar.audio_clock);
            });
            //listens to end of song and queues up the next in the list.
            //currently, this queries the DOM and checks for the next element.
            //in would probably be better to internally maintain the order of the playlist, but...later.
            this.audioElement.addEventListener('ended', function () {
                SpeakPlayer.Playlist.removeFromPlaylist(SpeakPlayer.Player.getCurrentlyPlayingSong());
            });
            this.audioElement.addEventListener("play", function () {
                var song = SpeakPlayer.Player.getCurrentlyPlayingSong();
                song.isPlaying = true;
                $('[data-song-id=' + song.id+']').addClass('playing');
                if (!SpeakPlayer.Player.controls.playPause.hasClass('playing')) {
                    SpeakPlayer.Player.setPlayPauseButton(true);
                }
                //clears previous seekbar intervals
                if (typeof(SpeakPlayer.Seekbar.audio_clock) !== "undefined") {
                    clearInterval(SpeakPlayer.Seekbar.audio_clock);
                    SpeakPlayer.Seekbar.audio_clock = '';
                }
                SpeakPlayer.Seekbar.startSeeking();
            });
        }
    },
    stopSong: function () {
        SpeakPlayer.Seekbar.stopSeeking();
        SpeakPlayer.Player.audioElement.pause();
        SpeakPlayer.Player.audioElement.remove();
        song.isLoaded = false;
        song.isPlaying = false;
    },
    clearCurrentlyPlayingSong: function () {
        this.audioElement.pause();
        this.audioElement.remove();
        this.audioElement = null;
        this.controls.startTime.text('0:00');
        this.controls.endTime.text('0:00');
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
        //if we cannot find in playlist array, grab from dom.
        return this.getSong(SpeakPlayer.Playlist.playlistContainer.find('.current').data('song-id'));
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
            this.controls.playPause.html(SpeakPlayer.Player.svgs.pauseSVG);
        } else {
            this.controls.playPause.removeClass('playing');
            this.controls.playPause.html(SpeakPlayer.Player.svgs.playSVG);
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
        SpeakPlayer.Seekbar.stopSeeking();
        //instantiate new audio element
        this.audioElement = new Audio(song.songUrl);
        this.audioElement.addEventListener("loadedmetadata", function (_event) {
            var duration = SpeakPlayer.Player.audioElement.duration;
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
        this.audioElement.pause();
        this.audioElement.load(); //suspends and restores all audio element
        this.audioElement.play();

        //sets up seekbar and song ended listeners. only called once since seekbar is single instance
        this.setListeners();

        /****************/
    }
};