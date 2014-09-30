(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['featuredTrack.hbs'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "<div class='featured-song cf'>\n    <div class='songImg'><img src=\""
    + escapeExpression(((helper = (helper = helpers.albumArtUrl || (depth0 != null ? depth0.albumArtUrl : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"albumArtUrl","hash":{},"data":data}) : helper)))
    + "\"/></div>\n    <div class='songInfo'><p class='status'>Featured</p>\n        <p class='songName'>"
    + escapeExpression(((helper = (helper = helpers.songName || (depth0 != null ? depth0.songName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"songName","hash":{},"data":data}) : helper)))
    + " <span class='by'>by</span></p><a class='artistName' href=''>"
    + escapeExpression(((helper = (helper = helpers.artistName || (depth0 != null ? depth0.artistName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"artistName","hash":{},"data":data}) : helper)))
    + "</a>\n        <p class='tag'>Categorized as\n            <a href='#' class='genre'>"
    + escapeExpression(((helper = (helper = helpers.genre || (depth0 != null ? depth0.genre : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"genre","hash":{},"data":data}) : helper)))
    + "</a> released on <a class='album' href='#'>"
    + escapeExpression(((helper = (helper = helpers.albumName || (depth0 != null ? depth0.albumName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"albumName","hash":{},"data":data}) : helper)))
    + "</a>\n            "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.song : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "</p>\n        <p class='trackInfo'>"
    + escapeExpression(((helper = (helper = helpers.trackInfo || (depth0 != null ? depth0.trackInfo : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"trackInfo","hash":{},"data":data}) : helper)))
    + "</p></div>\n</div>\n";
},"useData":true});
})();