/**
 * Created by vcimo5 on 9/30/14.
 */
SpeakPlayer.Library = {
    libraryContainer : "",
    feature : "",
    list : '',
    render: function (libraryContainer) {
        this.libraryContainer = libraryContainer;
        this.feature = libraryContainer.find('#featured');
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

    sizeLibraryContainer: function () {
        console.log("sizing container");
        var playlistHeight = SpeakPlayer.Playlist.playlistContainer.hasClass('active') ? SpeakPlayer.Playlist.playlistContainer.outerHeight() : 0,
            playerHeight = SpeakPlayer.Player.playerContainer.is(':visible') ? SpeakPlayer.Player.playerContainer.outerHeight() : 0,
            headerOffset = SpeakPlayer.Library.libraryContainer.find('#songContainer .header').offset().top,
            headerHeight = SpeakPlayer.Library.libraryContainer.find('#songContainer .header').outerHeight(),
            bottomMargin = parseInt(SpeakPlayer.Library.libraryContainer.find("#library").css('margin-bottom')),
            libHeight = $(window).height()-headerOffset-headerHeight-bottomMargin-playlistHeight-playerHeight;
            SpeakPlayer.Library.libraryContainer.find("#library").height(libHeight);


    },
    renderHeaderFilter: function () {
        var htmlHeader = Handlebars.templates['headerFilter.hbs'];
        this.libraryContainer.append(htmlHeader);
    },
    populatePlayer: function (obj) {
        var songFeature;
        $.each(obj, function (key, song) {
            var songObj = new SpeakPlayer.Song(song);

            if(songObj.isFeatured && songFeature == null){
                songFeature = songObj;
            } else if(window.location.hash.substring(1) == songObj.id){
                songFeature = songObj;
            }


            if($.inArray(songObj.genre, SpeakPlayer.Player.genres) == -1){
                SpeakPlayer.Player.genres.push(songObj.genre);
            }

            SpeakPlayer.Player.songs.push(songObj);

        });

        this.renderFeature(songFeature);
        this.renderHeaderFilter();
        this.renderGenreList();
        this.renderSongs();
        this.sizeLibraryContainer();
    },
    renderFeature : function(song){
        this.feature = this.libraryContainer.find('#featured');
        var htmlFeature = Handlebars.templates['featuredTrack.hbs'](song);

        if(this.feature.length > 0){
            this.feature.html(htmlFeature);
        } else{
            SpeakPlayer.Library.libraryContainer.prepend(htmlFeature);

        }

    },
    //renderSongs: function () {
    //    htmlHeader = "<div class='songList header cf'><p class='songName'>Song Name</p><p class='artistName'>Artist</p><p class='albumName'>Album</p><p class='date'>Date Released</p><p class='genre'>Genre</p></div><ul class='bySongs' id='library'>";
    //    htmlFeature = "";
    //    htmlSongs = "";
    //    $.each(SpeakPlayer.Player.songs, function (key, song) {
    //        if (!song.isFeatured) {
    //            song.albumArtUrl = song.albumArtUrl != null ? song.albumArtUrl : "";
    //            htmlSongs += "<li id='" + song.id + "' class='song cf' ><div class='playOptions'><span class='expand'>+</span><a class='playNow' href='#'>Play Now</a><a class='playNext' href='#'>Play Next</a><a class='addToPlaylist' href='#'>Add To Playlist</a></div><div class='songImg'><img src='" + song.albumArtUrl + "'/></div><div class='songInfo'><p class='songName'>" + song.songName + "</p><a class='artistName' href=''>" + song.artistName + "</a><p class='albumName'>" + song.albumName + "</p><p class='date'>" + song.releaseDate + "</p><p class='genre'>";
    //
    //            $.each(song.genres, function (key, genre) {
    //                htmlSongs += "<span>" + genre["name"] + "</span>";
    //            });
    //
    //            htmlSongs += "</p></div></li>";
    //        } else {
    //            htmlFeature += "<div class='featured-song cf'><div class='songImg'><img src='" + song.albumArtUrl + "'/></div><div class='songInfo'><p class='status'>Featured</p><p class='songName'>" + song.songName + " <span class='by'>by</span></p><a class='artistName' href=''>" + song.artistName + "</a><p class='tag'>Categorized as ";
    //            $.each(song.genres, function (key, genre) {
    //                htmlFeature += "<a href='#' class='genre'>" + genre["name"] + "</a>";
    //            });
    //            htmlFeature += ", released on <a class='album' href='#'>" + song.albumName + "</a>, " + song.releaseDate + "</p><p class='trackInfo'>" + song.trackInfo + "</p></div></div>";
    //        }
    //
    //    });
    //    htmlSongs += "</ul>";
    //    this.libraryContainer.prepend(htmlFeature).append(htmlHeader + htmlSongs);
    //}
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
    renderGenreList : function(){
        var html = "<div class='genres'><a href='#'>All</a>";
        $.each(SpeakPlayer.Player.genres, function(index, element){
            html += '<a href="#">'+element+'</a>';
        });
        html += "</div>";
        SpeakPlayer.Library.libraryContainer.append(html);

    },
    renderSongs : function(){

        var htmlSongs = Handlebars.templates['viewBySong.hbs'](SpeakPlayer.Player.songs);
        SpeakPlayer.Library.libraryContainer.append(htmlSongs);
        var options = {
            valueNames: [ 'songName','artistName', 'albumName','date','genre' ]
        };
        this.list = new List('libraryContainer', options);
}


//old style

};