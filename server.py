from flask import Flask, request, render_template, url_for
import json
import random
import copy
import pusher
import sys

app = Flask(__name__)
app.rooms = {}
app.default_matrix = [
	{"sample": "kick", "path": "/static/samples/kick.mp3", "triggers": [True, False, False, False, True, False, False, False, True, False, False, False, True, False, False, False]},
	{"sample": "hat", "path": "/static/samples/hat.mp3", "triggers": [False, False, True, False, False, False, True, False, False, False, True, False, False, False, True, False]},
	{"sample": "snare", "path": "/static/samples/snare.mp3", "triggers": [False, False, False, False, True, False, False, False, False, False, False, False, True, False, False, False]},
	{"sample": "crash" ,"path": "/static/samples/crash.mp3", "triggers": [True, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False]},
]

def randomRoomName():
	return "%s%d" % (random.choice(app.words), random.randint(1, 99))

@app.route("/change/<room>/<sample>/<position>", methods=['POST', 'DELETE'])
def change(room, sample, position):
	enabled = request.method == 'POST'

	for track in app.rooms[room]:
		if track["sample"] == sample:
			track["triggers"][int(position)] = enabled
	
	app.p[room].trigger('change', {"sample": sample, "position": position, "enabled": enabled})

	return "Done"

@app.route("/<room>")
def room(room):
	if not room in app.rooms:
		app.rooms[room] = copy.deepcopy(app.default_matrix)
	return render_template('room.html', matrix=json.dumps(app.rooms[room]), room=room)

@app.route("/")
def index():
	# Generate a random room name
	room = randomRoomName()
	while room in app.rooms:
		room = randomRoomName()

	return render_template('index.html', room=room)

def main():
	# Random words!
	app.words = open("/usr/share/dict/words").readlines()
	pusher.app_id = sys.argv[1];
	pusher.key = sys.argv[2];
	pusher.secret = sys.argv[3];
	app.p = pusher.Pusher()
	app.run(debug=True, host='0.0.0.0')

if __name__ == "__main__":
	main();