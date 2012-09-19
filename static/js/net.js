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

self.pushUpdate = function(sample, step, enabled){
	var url = "change/" + MusictionaryRoom + "/" + sample + "/" + step;
	if(enabled)
		$.ajax(url, {type: "POST"});
	else
		$.ajax(url, {type: "DELETE"});
};


return self;

};