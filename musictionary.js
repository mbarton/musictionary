var app = (function($){

var self = {}
self.matrix = [
	{"sample": "kick", "path": "samples/kick.mp3",
	 "triggers": [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]},
	{"sample": "hat", "path": "samples/hat.mp3",
	 "triggers": [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]},
	{"sample": "snare", "path": "samples/snare.mp3",
	 "triggers": [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]}, 
	{"sample": "crash", "path": "samples/crash.mp3",
	 "triggers": [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]}	 
];
self.cursor = 0;
self.tempo = 140;
self.audio = MusictionaryAudio();
self.ui = MusictionaryUI($, self);

self.update = function(sample, step, enabled){
	var track = _.find(self.matrix, function(track){ return track.sample === sample; });
	if(track.triggers[step] !== enabled){
		track.triggers[step] = enabled;
		// TODO MRB: tell pusher!
	}
};

self.playStep = function(){
	self.ui.setCursor(self.cursor);
	_.each(self.matrix, function(track){
		if(track.triggers[self.cursor])
			self.audio.playOnce(track.sample);
	});

	if(self.cursor === self.matrix[0].triggers.length - 1)
		self.cursor = 0;
	else
		self.cursor++;
};

self.msPerSemiquaver = function(){
	return ((1.0 / (self.tempo / 60.0)) / 4.0) * 1000;
};

self.play = function(){
	self.playStep();
	self.timer_id = setInterval(self.playStep, self.msPerSemiquaver());
};

self.stop = function(){
	clearInterval(self.timer_id);
	self.ui.setCursor(-1);
	self.cursor = 0;
}

$(function(){
	self.audio.loadSamples(self.matrix);
	self.ui.buildMatrix(self.matrix);
});

return self;

})(jQuery);