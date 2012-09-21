MusictionaryUI = function($, app){

var self = {}
var UP_ARROW = 38;
var DOWN_ARROW = 40;
var X_KEY = 88;

var KEYS_TO_NOTES = {
	90: "C",
	83: "Cs",
	88: "D",
	68: "Ds",
	67: "E",
	86: "F",
	71: "Fs",
	66: "G",
	72: "Gs",
	78: "A",
	74: "As",
	77: "B"
};

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
	{
		// Add note if needed
		var track = _.find(app.matrix, function(track){ return track.sample === instrument; });
		if(track.melodic)
			trigger.html(track.notes[index]);
		trigger.addClass("enabled");
	}
	else
	{
		trigger.removeClass("enabled");
		// remove note text if there
		trigger.html("");
	}
};

self.setNote = function(instrument, index, note){
	var trigger = $($(".label:contains(" + instrument + ")").siblings()[index]);
	trigger.html(note);
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
	}

	// Bring the pain!
	// Work out which note we need using the magic note mapping!
	var sample = $(".editing").html();
	var track = _.find(app.matrix, function(track){ return track.sample === sample; });
	if(track.melodic)
	{
		var note = KEYS_TO_NOTES[ev.keyCode];
		if(note !== undefined)
		{
			// TODO MRB: toggling notes!
			console.log(note);
			if(self.cursor !== -1)
				app.toggle(sample, self.cursor);
				app.setNote(sample, self.cursor, note);
			// Hapticityityityityity
			app.audio.playNote(sample, note);
		}
	}
	else if(ev.keyCode === X_KEY)
	{
		if(self.cursor !== -1)
			app.toggle(sample, self.cursor);
		// Hapticity
		app.audio.playOnce(sample);
	}
});

});

return self;

};