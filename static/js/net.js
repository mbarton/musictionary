MusictionaryNet = function(secret, app, ui){

var self = {};

// Pusher logging. Disable in prod
Pusher.log = function(msg){
	console.log(msg);
}
WEB_SOCKET_DEBUG = true;

self.pusher = new Pusher(secret.pusher_key);
self.channel = self.pusher.subscribe(MusictionaryRoom);
self.channel.bind('change', function(data){
	app.update(data.sample, data.position, data.enabled, "LOCAL_ONLY");
	ui.setTrigger(data.sample, data.position, data.enabled);
});
self.channel.bind('note', function(data){
	app.setNote(data.sample, data.position, data.note, "LOCAL_ONLY");
	ui.setNote(data.sample, data.position, data.note);
});

self.pushUpdate = function(sample, step, enabled){
	//* ENABLE SERVER COMMS
	var url = "change/" + MusictionaryRoom + "/" + sample + "/" + step;
	if(enabled)
		$.ajax(url, {type: "POST"});
	else
		$.ajax(url, {type: "DELETE"});
	//*/
};

self.pushNote = function(sample, step, note){
	//* ENABLE SERVER COMMS
	var url = "note/" + MusictionaryRoom + "/" + sample + "/" + step + "/" + note;
	$.ajax(url, {type: "POST"});
	//*/
}


return self;

};