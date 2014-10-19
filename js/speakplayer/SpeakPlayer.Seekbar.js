/**
 * Created by vcimo5 on 9/30/14.
 */
SpeakPlayer.Seekbar = {
    value : 0,
    audio_clock : '',
    seekBar : '',
    init : function(){
        this.seekBar = SpeakPlayer.Player.controls.seekBar.slider({
            range: "min",
            value: 0,
            min: 1
        });
        //stops seeking when use begins drag
        this.seekBar.on("slidestart", function () {
            console.log("slidestart");
            SpeakPlayer.Seekbar.pauseSeeking();

        });
        this.seekBar.on("slidechange", function (event, ui) {
            //track time change on seekbar
            SpeakPlayer.Player.controls.startTime.html(SpeakPlayer.Seekbar.secondsToTime(ui.value / 10));
        });
        //resumes seeking when user ends drag
        this.seekBar.on("slidestop", function (event, ui) {

            SpeakPlayer.Seekbar.value = SpeakPlayer.Seekbar.seekBar.slider("value") || 0;
            SpeakPlayer.Player.audioElement.currentTime = SpeakPlayer.Seekbar.value / 10;
            if (SpeakPlayer.Player.getCurrentlyPlayingSong().isPlaying && SpeakPlayer.Seekbar.audio_clock == '') {
                SpeakPlayer.Seekbar.startSeeking();
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
        this.audio_clock = setInterval(SpeakPlayer.Seekbar.seekCounter, 100);
        return this.audio_clock;
    },
    pauseSeeking : function(){
        clearInterval(this.audio_clock);
        this.audio_clock = '';
    },
    stopSeeking : function(){
        console.log("stopping seek");
        this.pauseSeeking();
        this.value = 0;
    },
    seekCounter : function(){
        SpeakPlayer.Seekbar.value += 1;
        SpeakPlayer.Seekbar.seekBar.slider("value", SpeakPlayer.Seekbar.value);

    }
}