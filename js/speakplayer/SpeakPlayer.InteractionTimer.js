/**
 * Created by vcimo5 on 9/30/14.
 */
SpeakPlayer.InteractionTimer = {
    interactionTimer : '',
    start: function () {
        if(!is_touch_device()) {

            SpeakPlayer.Library.libraryContainer.hover(function () {
                    console.log("clearing timer");

                    SpeakPlayer.Player.lowerVisualizerOpacity();
                },
                function () {
                    console.log("setting timer");

                    SpeakPlayer.InteractionTimer.interactionTimer = setTimeout(function () {
                        SpeakPlayer.InteractionTimer.onNoInteraction();
                    }, 5000);
                });
        }
    },

    onNoInteraction: function () {
        $('canvas.sketch').addClass('opaque');
        SpeakPlayer.Library.libraryContainer.addClass('transparent');
    }
}