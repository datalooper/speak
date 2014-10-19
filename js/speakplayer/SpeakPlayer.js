/**
 * Created by vcimo5 on 9/30/14.
 */
jQuery(document).ready(function ($) {

});

SpeakPlayer = {
    isInitialized : "false",
    init: function (libraryContainer, playerContainer, playlistContainer) {
        console.log("init attempt. player.isInitialized= %s, libraryContainer.length= %s", this.isInitialized, libraryContainer.length);
        if (this.isInitialized == "false" && libraryContainer.length > 0) {
            var ajaxLoaderEl = $('body').find('#ajaxLoader');
            var loader = setInterval(function(){
                if(libraryContainer.height() > 0) {
                    ajaxLoaderEl.fadeOut();
                    clearInterval(loader);
                }
            }, 100);
            //just in case
            setTimeout(function(){
                clearInterval(loader);
            },3000);
            this.Library.render(libraryContainer);
            this.Playlist.render(playlistContainer);
            this.isInitialized = "true";
            this.Player.render(playerContainer);		//only want to call once
            //this.Visualizer.initVisualizer();

        }
    }




};

