(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['viewBySong.hbs'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <li id="
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + " class='song cf'>\n        <div class='playOptions'><span class='expand'>+</span><a class='playNow' href='#'>Play Now</a><a\n                class='playNext' href='#'>Play Next</a><a class='addToPlaylist' href='#'>Add To Playlist</a></div>\n        <div class='songImg'><img src='"
    + escapeExpression(((helper = (helper = helpers.albumArtUrl || (depth0 != null ? depth0.albumArtUrl : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"albumArtUrl","hash":{},"data":data}) : helper)))
    + "'/></div>\n        <div class='songInfo'><p class='songName'>"
    + escapeExpression(((helper = (helper = helpers.songName || (depth0 != null ? depth0.songName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"songName","hash":{},"data":data}) : helper)))
    + "</p>\n            <a class='artistName' href=''>"
    + escapeExpression(((helper = (helper = helpers.artistName || (depth0 != null ? depth0.artistName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"artistName","hash":{},"data":data}) : helper)))
    + "</a>\n\n            <p class='albumName'>"
    + escapeExpression(((helper = (helper = helpers.albumName || (depth0 != null ? depth0.albumName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"albumName","hash":{},"data":data}) : helper)))
    + "</p>\n\n            <p class='date'>"
    + escapeExpression(((helper = (helper = helpers.releaseDate || (depth0 != null ? depth0.releaseDate : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"releaseDate","hash":{},"data":data}) : helper)))
    + "</p>\n\n            <p class='genre'></p></div>\n    </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class='songList header cf'><p class='songName'>Song Name</p>\n    <p class='artistName'>Artist</p>\n    <p class='albumName'>Album</p>\n    <p class='date'>Date Released</p>\n    <p class='genre'>Genre</p></div>\n<ul class='bySongs' id='library'>\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.SpeakPlayer : depth0)) != null ? stack1.Song : stack1), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul>\n\n";
},"useData":true});
})();