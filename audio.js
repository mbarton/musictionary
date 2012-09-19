MusictionaryAudio = function(){

var self = {};
self.ctx = new webkitAudioContext();
self.samples = {}

self.decodeAudio = function(track, buf){
	self.ctx.decodeAudioData(buf, function(aud){
		console.log("Decoded " + track);
		self.samples[track].audio = aud;
	});
}

self.loadSample = function(track, path){
	if(self.samples[track] !== undefined &&
	   self.samples[track].path === path)
		return;

	self.samples[track] = {"path": path};

	var req = new XMLHttpRequest();
	req.onload = function(args){
		console.log("Downloaded " + path + " for track " + track);
		self.decodeAudio(track, args.target.response);
	}
	req.open('GET', path, true);
	req.responseType = 'arraybuffer';
	req.send();
};

self.loadSamples = function(matrix){
	_.each(matrix, function(track){
		self.loadSample(track.sample, track.path);
	});
}

self.playOnce = function(track){
	var src = self.ctx.createBufferSource();
	src.buffer = self.samples[track].audio;
	src.connect(self.ctx.destination);
	src.noteOn(0);
};

return self;

};