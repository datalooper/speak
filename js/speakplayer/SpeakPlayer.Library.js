/**
 * Created by vcimo5 on 9/30/14.
 */
SpeakPlayer.Library = {
    libraryContainer : "",
    render: function (libraryContainer) {
        this.libraryContainer = libraryContainer;
        this.preparePlayerData();
    },

    preparePlayerData: function () {
        var data = {
            action: 'get_songs',
            security: MyAjax.security,
            whatever: 1234
        };

        // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
        $.post(MyAjax.ajaxurl, data, function (response) {
            var obj = jQuery.parseJSON(response);
            SpeakPlayer.Library.populatePlayer(obj);
        });
    },

    populatePlayer: function (obj) {

        $.each(obj, function (key, song) {
            var songObj = Song.create(song);
            SpeakPlayer.Player.songs.push(songObj);
        });
        this.renderSongs();
    },

    renderSongs: function () {
        htmlHeader = "<div class='songList header cf'><p class='songName'>Song Name</p><p class='artistName'>Artist</p><p class='albumName'>Album</p><p class='date'>Date Released</p><p class='genre'>Genre</p></div><ul class='bySongs' id='library'>";
        htmlFeature = "";
        htmlSongs = "";
        $.each(SpeakPlayer.Player.songs, function (key, song) {
            if (!song.isFeatured) {
                song.albumArtUrl = song.albumArtUrl != null ? song.albumArtUrl : "";
                htmlSongs += "<li id='" + song.id + "' class='song cf' ><div class='playOptions'><span class='expand'>+</span><a class='playNow' href='#'>Play Now</a><a class='playNext' href='#'>Play Next</a><a class='addToPlaylist' href='#'>Add To Playlist</a></div><div class='songImg'><img src='" + song.albumArtUrl + "'/></div><div class='songInfo'><p class='songName'>" + song.songName + "</p><a class='artistName' href=''>" + song.artistName + "</a><p class='albumName'>" + song.albumName + "</p><p class='date'>" + song.releaseDate + "</p><p class='genre'>";

                $.each(song.genres, function (key, genre) {
                    htmlSongs += "<span>" + genre["name"] + "</span>";
                });

                htmlSongs += "</p></div></li>";
            } else {
                htmlFeature += "<div class='featured-song cf'><div class='songImg'><img src='" + song.albumArtUrl + "'/></div><div class='songInfo'><p class='status'>Featured</p><p class='songName'>" + song.songName + " <span class='by'>by</span></p><a class='artistName' href=''>" + song.artistName + "</a><p class='tag'>Categorized as ";
                $.each(song.genres, function (key, genre) {
                    htmlFeature += "<a href='#' class='genre'>" + genre["name"] + "</a>";
                });
                htmlFeature += ", released on <a class='album' href='#'>" + song.albumName + "</a>, " + song.releaseDate + "</p><p class='trackInfo'>" + song.trackInfo + "</p></div></div>";
            }

        });
        htmlSongs += "</ul>";
        this.libraryContainer.prepend(htmlFeature).append(htmlHeader + htmlSongs);
    }
    //function renderSongs(){
//    htmlHeader = "<div class='libraryHeader'>Search</div>";
//	htmlSongs = "<ul class='byAlbum'>";
//    albumArtArray = [];
//    htmlFeature = "";
//
//    $.each( SpeakPlayer.player.songs, function( key, song ) {
//
//        if(song.isFeatured){
//            htmlFeature = Handlebars.templates['featuredTrack.hbs'](song);
//        }
//
//        if($.inArray(song.artistName, albumArtArray) == -1){
//            htmlSongs += "<li id='" + song.id+"' class='song cf' ><div class='songImg'><img src='"+song.albumArtUrl+"'/></div>'";
//            htmlSongs+= "</li>";
//            albumArtArray.push(song.artistName);
//        }
//
//
//
//	});
//	htmlSongs += "</ul>";
//	SpeakPlayer.player.libraryContainer.prepend(htmlFeature).append(htmlSongs);
//}


//old style

};