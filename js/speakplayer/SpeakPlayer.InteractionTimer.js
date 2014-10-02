/**
 * Created by vcimo5 on 9/30/14.
 */
SpeakPlayer.InteractionTimer = {
    start: function () {

        var interactionTimer = setTimeout(function () {
            onNoInteraction();
        }, 5000);

        SpeakPlayer.player.libraryContainer.hover(function () {
                $('canvas.sketch').removeClass('opaque');

                SpeakPlayer.player.libraryContainer.removeClass('transparent');
                clearTimeout(interactionTimer);
            },
            function () {
                interactionTimer = setTimeout(function () {
                    onNoInteraction();
                }, 5000);
            });
    },
    onNoInteraction: function () {
        $('canvas.sketch').addClass('opaque');
        SpeakPlayer.player.libraryContainer.addClass('transparent');
    }
}