var app = (function($){

var self = {}
/*// Enable this for offline testing!
self.matrix = [
	{"sample": "kick", "path": "static/samples/kick.mp3", "editing": "true",
	 "triggers": [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]},
	{"sample": "hat", "path": "static/samples/hat.mp3",
	 "triggers": [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]},
	{"sample": "snare", "path": "static/samples/snare.mp3",
	 "triggers": [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]}, 
	{"sample": "crash", "path": "static/samples/crash.mp3",
	 "triggers": [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]},
	{"sample": "bass", "path": "static/samples/bass.mp3", "melodic": "true",
	 "triggers": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
	 "notes": ["C", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]}
];
//*/
self.cursor = 0;
self.tempo = 120;
// Matrix is included by Flask on initial load
self.matrix = MusictionaryMatrix;
self.secret = MusictionarySecret();
self.audio = MusictionaryAudio();
self.ui = MusictionaryUI($, self);
self.net = MusictionaryNet(self.secret, self, self.ui);
self.fb = MusictionaryFacebook(self.secret);

self.editTrack = function(ix){
	_.each(self.matrix, function(track){
		track.editing = false;
	});

	self.matrix[ix].editing = true;

	self.ui.setEditing(ix);
}

self.toggle = function(sample, step){
	var track = _.find(self.matrix, function(track){ return track.sample === sample; });
	track.triggers[step] = !track.triggers[step];
	self.net.pushUpdate(sample, step, track.triggers[step]);
	self.ui.setTrigger(sample, step, track.triggers[step]);
};

self.setNote = function(sample, step, note, local_only){
	var track = _.find(self.matrix, function(track){ return track.sample === sample; });
	track.notes[step] = note;
	if(local_only === undefined)
		self.net.pushNote(sample, step, note);
	self.ui.setNote(sample, step, note);
}

self.update = function(sample, step, enabled, local_only){
	var track = _.find(self.matrix, function(track){ return track.sample === sample; });
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
		{
			if(track.melodic)
				self.audio.playNote(track.sample, track.notes[self.cursor]);
			else
				self.audio.playOnce(track.sample);
		}
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
