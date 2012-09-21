var app = (function($){

var self = {}
/* Enable this for offline testing!
self.matrix = [
	{"sample": "kick", "path": "static/samples/kick.mp3",
	 "triggers": [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]},
	{"sample": "hat", "path": "static/samples/hat.mp3",
	 "triggers": [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]},
	{"sample": "snare", "path": "static/samples/snare.mp3",
	 "triggers": [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]}, 
	{"sample": "crash", "path": "static/samples/crash.mp3",
	 "triggers": [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]}	 
];
*/
self.cursor = 0;
self.tempo = 140;
// Matrix is included by Flask on initial load
self.matrix = MusictionaryMatrix;
self.secret = MusictionarySecret();
self.audio = MusictionaryAudio();
self.ui = MusictionaryUI($, self);
self.net = MusictionaryNet(self.secret, self, self.ui);

self.update = function(sample, step, enabled, local_only){
	var track = _.find(self.matrix, function(track){ return track.sample === sample; })
	if(track.triggers[step] !== enabled){
		track.triggers[step] = enabled;
		if(local_only === undefined)
			self.net.pushUpdate(sample, step, enabled);
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

self.currentUserId = null;

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