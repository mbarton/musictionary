MusictionaryUI = function($, app){

var self = {}

self.buildMatrix = function(matrix)
{
	var seq_elem = $("#sequencer");
	seq_elem.children().empty();

	_.each(matrix, function(track){
		var row = $("<div class='track row'></div>")
			       .append("<div class='label span1'>" + track.sample + "</div>")
		
		_.each(track.triggers, function(trigger){
			var trigger_elem = $("<div class='trigger span1'>&nbsp;</div>");
			if(trigger)
				trigger_elem.addClass("enabled");

			row.append(trigger_elem);
		});

		seq_elem.append(row);
	});
};

self.setTrigger = function(instrument, index, enabled){
	var trigger = $($(".label:contains(" + instrument + ")").siblings()[index]);
	if(enabled)
		trigger.addClass("enabled");
	else
		trigger.removeClass("enabled");
};

self.setCursor = function(index){
	$(".trigger").removeClass("triggered");
	$(".track").each(function(){
		$($(this).children(".trigger")[index]).addClass("triggered");
	});
};

// Handlers
$(function(){

$(".trigger").live("click", function(){
	var instrument = $(this).parent().children(".label").html();
	var index = $(this).parent().children(".trigger").index(this);
	// Flip flop!
	var enabled = !$(this).hasClass("enabled");
	
	app.update(instrument, index, enabled);

	// Could call setTrigger but not going to for performance!
	$(this).toggleClass("enabled");
});

$("#play").click(function(){
	app.play();
});

$("#stop").click(function(){
	app.stop();
});

});

return self;

};