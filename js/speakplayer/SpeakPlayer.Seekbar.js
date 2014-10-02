/**
 * Created by vcimo5 on 9/30/14.
 */
SpeakPlayer.Seekbar = {
    init : function(){
        seekBar = SpeakPlayer.Player.controls.seekBar;
        //stops seeking when use begins drag
        seekBar.on("slidestart", function () {
            clearInterval(audio_clock);
        });
        seekBar.on("slidechange", function (event, ui) {
            //track time change on seekbar
            SpeakPlayer.Player.controls.startTime.html(SpeakPlayer.Seekbar.secondsToTime(ui.value / 10));
        });
        //resumes seeking when user ends drag
        seekBar.on("slidestop", function (event, ui) {

            value = seekBar.slider("value");
            SpeakPlayer.Player.audioElement.currentTime = value / 10;
            if (SpeakPlayer.Player.getCurrentlyPlayingSong().isPlaying) {
                audio_clock = SpeakPlayer.Seekbar.startSeeking();
            }
        });
    },
    secondsToTime : function(raw) {
        var time = parseInt(raw, 10);
        time = time < 0 ? 0 : time;

        var minutes = Math.floor(time / 60);
        var seconds = time % 60;

        seconds = seconds < 10 ? "0" + seconds : seconds;
        return minutes + ":" + seconds;
    },
    //begins seeking. We avoid using the player callbacks, because they only execute every 250ms,
    //making the seekBar seem grainy.
    startSeeking : function() {
        return setInterval(function () {
            value += 1;
            SpeakPlayer.Player.controls.seekBar.slider("value", value);

        }, 100);
    }
}