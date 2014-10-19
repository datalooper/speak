/**
 * Created by vcimo5 on 9/30/14.
 */

SpeakPlayer.Volumeslider = {
    volumeSlider : '',
    prevVolume : '',
init : function(){
            this.volumeSlider = SpeakPlayer.Player.controls.volumeSlider;
            this.volumeSlider.on('slide', function (event, ui) {
                if (SpeakPlayer.Player.audioElement != null) {
                    SpeakPlayer.Player.audioElement.volume = ui.value / 100;
                }
            });
        }

}