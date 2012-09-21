MusictionaryAudio = function(){

var self = {};
self.ctx = new webkitAudioContext();
self.samples = {}

self.decodeAudio = function(track, buf, note){
	self.ctx.decodeAudioData(buf, function(aud){
		console.log("Decoded " + track + " " + (note ? note : "one-shot"));
		if(note === undefined)
			self.samples[track].audio = aud;
		else
			self.samples[track][note] = aud;
	});
}

self.loadOneShot = function(track, path, note){
	var req = new XMLHttpRequest();
	req.onload = function(args){
		console.log("Downloaded " + path + " for track " + track);
		self.decodeAudio(track, args.target.response, note);
	}
	req.open('GET', path, true);
	req.responseType = 'arraybuffer';
	req.send();
}

self.loadMelodic = function(track, path){
	_.each(["A", "As", "B", "C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs"], function(note){
		var samplePath = path.substring(0, path.indexOf(".")) + note + ".mp3"; 
		self.loadOneShot(track, samplePath, note);
	});	
}

self.loadSample = function(track){
	if(self.samples[track.sample] !== undefined &&
	   self.samples[track.sample].path === track.path)
		return;

	self.samples[track.sample] = {}
	//self.samples[track.sample] = {"path": track.path};

	if(track.melodic)
		self.loadMelodic(track.sample, track.path);
	else
		self.loadOneShot(track.sample, track.path);
};

self.loadSamples = function(matrix){
	_.each(matrix, self.loadSample);
}

self.playOnce = function(track){
	var src = self.ctx.createBufferSource();
	src.buffer = self.samples[track].audio;
	src.connect(self.ctx.destination);
	src.noteOn(0);
};

self.playNote = function(track, note){
	var src = self.ctx.createBufferSource();
	src.buffer = self.samples[track][note];
	src.connect(self.ctx.destination);
	src.noteOn(0);
}

return self;

};