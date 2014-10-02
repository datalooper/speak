/**
 * Created by vcimo5 on 9/30/14.
 */

SpeakPlayer.Volumeslider = {
    init : function(){
           var volumeSlider = SpeakPlayer.Player.controls.volumeSlider;
            volumeSlider.on('slide', function (event, ui) {
                if (audio != null) {
                    console.log(ui.value);
                    audio.volume = ui.value / 100;
                }
            });
        }

}