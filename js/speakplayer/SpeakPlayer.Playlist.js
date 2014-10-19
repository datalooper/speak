/**
 * Created by vcimo5 on 9/30/14.
 */
SpeakPlayer.Playlist = {
    playlist: [],
    playlistContainer: "",
    SMALL_SCREEN_WIDTH: 640,
    customScrollBar : '',
    hidePlaylistHelper : '',
    render: function (playlistContainer) {
        this.playlistContainer = playlistContainer;
        var html = "<ul class='cf' id='playlistUl'></ul>";
        this.playlistContainer.append(html);
        if($(window).width() > this.SMALL_SCREEN_WIDTH) {
            console.log("scroll slider");
            this.setupScrollSlider();
        }
    },

    //removes element from playlist by recreating array
    removeFromPlaylist: function (song) {

        if (song == SpeakPlayer.Player.getCurrentlyPlayingSong()) {

            var nextSong = SpeakPlayer.Player.getNextSong();
            SpeakPlayer.Player.stopSong();
            SpeakPlayer.Player.clearCurrentlyPlayingSong();
            if (nextSong != null) {
                SpeakPlayer.Player.changeSong(nextSong);
            }
        }

        this.playlist = jQuery.grep(this.playlist, function (value) {
            return value != song;
        });
        SpeakPlayer.Playlist.playlistContainer.find('[data-song-id=' + song.id+']').remove();
        SpeakPlayer.Library.libraryContainer.find('[data-song-id=' + song.id+']').removeClass('current playing inPlaylist');

    },
    addToPlaylist: function (song, playOrder) {
        //display playlist object on screen
        var playerUl = this.playlistContainer.find('ul'),
            htmlPlaying = "<li data-song-id='" + song.id + "' class='playing current song'>",
            htmlNoPlay = "<li data-song-id='" + song.id + "' class='song'>",
            librarySong = SpeakPlayer.Library.libraryContainer.find('[data-song-id=' + song.id + ']'),

            html = "<img src='" + song.albumArtUrl + "'/><div class='songInfo'><p class='songName'>" + song.songName +
            "</p><p class='artistName'>" + song.artistName + "</p></div><div class='playOverlay'><a href='#' class='play'>" + SpeakPlayer.Player.svgs.playSVG + "</a><a href='#' class='pause'>" + SpeakPlayer.Player.svgs.pauseSVG + "</a></div><a href='#' class='remove'></li>";
        SpeakPlayer.Player.playerContainer.show();
        SpeakPlayer.Player.controls.playlistHelper.html(SpeakPlayer.Playlist.playlist.length+1).show();
        if(this.hidePlaylistHelper != ''){
            clearTimeout(this.hidePlaylistHelper);
        }
        this.hidePlaylistHelper = setTimeout(function(){
            SpeakPlayer.Player.controls.playlistHelper.fadeOut();
        }, 1000);

        if (this.playlistContainer.find('[data-song-id=' + song.id + ']').length > 0) {
            return false;
        } else if (jQuery.isEmptyObject(SpeakPlayer.Playlist.playlist) || playOrder == SpeakPlayer.Player.PLAY_NOW) {
            playerUl.prepend(htmlPlaying + html);
            SpeakPlayer.Player.changeSong(song);
            SpeakPlayer.Library.libraryContainer.addClass('playing');
            SpeakPlayer.Library.sizeLibraryContainer();
            playerUl.sortable().disableSelection();
        } else if (playOrder == SpeakPlayer.Player.ADD_TO_PLAYLIST) {
            playerUl.append(htmlNoPlay + html);
        } else if (playOrder == SpeakPlayer.Player.PREPEND_PLAYLIST) {
            playerUl.prepend(htmlPlaying + html);
        } else
        {
            playerUl.find('.current').after(htmlNoPlay + html);
        }
        librarySong.addClass('inPlaylist');
        this.playlist.push(song);
        if($('window').width() > this.SMALL_SCREEN_WIDTH && this.customScrollBar == '') {
            this.setupScrollSlider();
        }
    },

    setupScrollSlider: function () {
        this.customScrollBar = this.playlistContainer.mCustomScrollbar({
            axis: "x",
            advanced: {
                autoExpandHorizontalScroll: true
            }
        });
    }
}

