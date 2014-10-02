this.controls.el = this.playerContainer.find('#controls');
this.controls.playPause = this.playerContainer.find('.playPause');
this.controls.stop = this.playerContainer.find('.stop');
this.controls.next = this.playerContainer.find('.next');
this.controls.playlist = this.playerContainer.find('.playlist');
this.controls.volumeSlider = this.playerContainer.find('#volumeSlider').slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 100,
    value: 60
});
this.controls.seekBar = this.playerContainer.find('.seekBar').slider({
    range: "min",
    value: 0,
    min: 1
});
this.controls.startTime = this.playerContainer.find('#startTime');
this.controls.endTime = this.playerContainer.find('#endTime');