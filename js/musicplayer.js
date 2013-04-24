$(document).ready(function(){
  $("#jquery_jplayer_1").jPlayer({
    ready: function () {
      $(this).jPlayer("setMedia", {
      mp3:"http://c1.glitch.bz/wp-uploads/main/2010/12/Groddle-Theme-Snappy-Mix_1291876544.mp3"
    });
  },
      swfPath: "js",
      supplied: "mp3",
      wmode: "window",
      smoothPlayBar: true,
      keyEnabled: true,
  });
});