MusictionaryUI = function($, app){

var self = {}
var UP_ARROW = 38;
var DOWN_ARROW = 40;
var X_KEY = 88;

self.cursor = -1;

self.buildMatrix = function(matrix)
{
	var seq_elem = $("#sequencer");
	seq_elem.children().empty();

	_.each(matrix, function(track){
		var label = $("<div class='label span1'></div>");
		label.html(track.sample);

		if(track.editing)
			label.addClass("editing");

		var row = $("<div class='track row'></div>")
			       .append(label);
		
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
	self.cursor = index;

	$(".trigger").removeClass("triggered");
	$(".track").each(function(){
		$($(this).children(".trigger")[index]).addClass("triggered");
	});
};

self.setEditing = function(index){
	console.log("editing " + index);
	$(".editing").removeClass("editing");
	$(".label:eq(" + index + ")").addClass("editing");
}

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

$("body").keydown(function(ev){
	switch(ev.keyCode)
	{
		case UP_ARROW:
			var current_index = $(".label").index($(".editing"));
			var new_index = -1;
			if(current_index == 0)
				new_index = app.matrix.length - 1;
			else
				new_index = current_index - 1;

			app.editTrack(new_index);
			break;
		case DOWN_ARROW:
			var current_index = $(".label").index($(".editing"));
			var new_index = -1;
			if(current_index == app.matrix.length - 1)
				new_index = 0;
			else
				new_index = current_index + 1;

			app.editTrack(new_index);
			break;
		case X_KEY:
			if(self.cursor !== -1)
			{
				var sample = $(".editing").html();
				app.toggle(sample, self.cursor);
				// App triggers the UI update. MANY LOLZ!
				// HEY USER! You actually did something so play the sound!
				app.audio.playOnce(sample);
			}
			break;

	}
});

});

return self;

};