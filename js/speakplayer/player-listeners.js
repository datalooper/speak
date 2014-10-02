

//begins seeking. We avoid using the player callbacks, because they only execute every 250ms, 
//making the seekBar seem grainy.
function startSeeking() {
    return setInterval(function () {
        value += 1;
        player.controls.seekBar.slider("value", value);

    }, 100);
}