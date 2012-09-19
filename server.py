from flask import Flask, request, render_template
import json
import pusher
import sys

app = Flask(__name__)
app.matrix = [
	{"sample": "kick", "path": "static/samples/kick.mp3", "triggers": [True, False, False, False, True, False, False, False, True, False, False, False, True, False, False, False]},
	{"sample": "hat", "path": "static/samples/hat.mp3", "triggers": [False, False, True, False, False, False, True, False, False, False, True, False, False, False, True, False]},
	{"sample": "snare", "path": "static/samples/snare.mp3", "triggers": [False, False, False, False, True, False, False, False, False, False, False, False, True, False, False, False]},
	{"sample": "crash" ,"path": "static/samples/crash.mp3", "triggers": [True, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False]},
]

@app.route("/change/<room>/<sample>/<position>", methods=['POST', 'DELETE'])
def change(room, sample, position):
	enabled = request.method == 'POST'

	for track in app.matrix:
		if track["sample"] == sample:
			track["triggers"][int(position)] = enabled
	
	app.p["musictionary"].trigger('change', {"sample": sample, "position": position, "enabled": enabled})

	return "Done"

@app.route("/")
def index():
	return render_template('index.html', matrix=json.dumps(app.matrix))

def main():
	pusher.app_id = sys.argv[1];
	pusher.key = sys.argv[2];
	pusher.secret = sys.argv[3];
	app.p = pusher.Pusher()
	app.run(debug=True, host='0.0.0.0')

if __name__ == "__main__":
	main();