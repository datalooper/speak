/**
 * Created by vcimo5 on 9/30/14.
 */
//defines song model

var Song = function(){};

Song.prototype = {
    isFeatured : false,
    isPlaying : false,
        isLoaded : false,
        trackInfo : '',
        artistName : 'artist',
        albumName : 'album',
        songName : 'track',
        songUrl : '',
        releaseDate : '',
        albumArtUrl : '',
        id : '-1',
        genres : '',

    create : function(obj) {
        // IF AN OBJECT WAS PASSED THEN INITIALISE PROPERTIES FROM THAT OBJECT
        var song = new Song();
        for (var prop in obj) song[prop] = obj[prop];
        return song;
    }
}

Song = new Song();