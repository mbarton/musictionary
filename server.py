from flask import Flask, request, render_template, url_for
import json
import random
import copy
import threading
import cPickle as pickle
import pusher
import sys

app = Flask(__name__)
app.rooms = {}
app.default_matrix = [
	{"sample": "kick", "path": "/static/samples/kick.mp3", "melodic": False, "triggers": [True, False, False, False, True, False, False, False, True, False, False, False, True, False, False, False]},
	{"sample": "hat", "path": "/static/samples/hat.mp3", "melodic": False, "triggers": [False, False, True, False, False, False, True, False, False, False, True, False, False, False, True, False]},
	{"sample": "snare", "path": "/static/samples/snare.mp3", "melodic": False, "triggers": [False, False, False, False, True, False, False, False, False, False, False, False, True, False, False, False]},
	{"sample": "crash" ,"path": "/static/samples/crash.mp3", "melodic": False, "triggers": [True, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False]},
	{"sample": "bass", "path": "/static/samples/bass.mp3", "melodic": True,
	 "triggers": [False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False],
	 "notes": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], "editing": True}
]
app.users = {}

def randomRoomName():
	return "%s%d" % (random.choice(app.words), random.randint(1, 99))

def persist():
	pickle.dump(app.rooms, open("db", "w"))
	app.persist_timer = threading.Timer(5.0, persist)
	app.persist_timer.start()

@app.route("/change/<room>/<sample>/<position>", methods=['POST', 'DELETE'])
def change(room, sample, position):
	enabled = request.method == 'POST'

	for track in app.rooms[room]:
		if track["sample"] == sample:
			track["triggers"][int(position)] = enabled
	
	app.p[room].trigger('change', {"sample": sample, "position": position, "enabled": enabled})

	return "Done"

@app.route("/note/<room>/<sample>/<position>/<note>", methods=['POST'])
def note(room, sample, position, note):
	for track in app.rooms[room]:
		if track["melodic"] and track["sample"] == sample:
			track["notes"][int(position)] = note
			app.p[room].trigger('note', {"sample": sample, "position": position, "note": note})

	return "Done"

@app.route("/player/<room>/<facebook_id>", methods=['GET', 'POST', 'DELETE'])
def player(room, facebook_id):
	#Add or remove a player from a room
	if request.method == 'POST':
		print "adding player {0} to room {1}".format(facebook_id, room)
		app.p[room].trigger('presence', {"state": "add","facebook_id": facebook_id})
		app.users[room].append(facebook_id)
	elif request.method == 'DELETE':
		print "removing player {0} to room {1}".format(facebook_id, room)
		app.p[room].trigger('presence', {"state": "del","facebook_id": facebook_id})
		app.users[room].remove(facebook_id)
	else:
		return json.dumps(app.users[room])

	return "Done"

@app.route("/<room>")
def room(room):
	if room == "favicon.ico":
		# LOL
		return ""

	if not room in app.rooms:
		app.rooms[room] = copy.deepcopy(app.default_matrix)
		app.users[str(room)] = []
	return render_template('room.html', matrix=json.dumps(app.rooms[room]), room=room)

@app.route("/")
def index():
	# Generate a random room name
	room = randomRoomName()
	while room in app.rooms:
		room = randomRoomName()
	
	app.users[str(room)] = []

	# Build a list of random existing rooms
	max_room_links = 10 if len(app.rooms) > 10 else len(app.rooms)
	random_existing_rooms = random.sample(app.rooms.keys(), max_room_links)
	params = {"newroom": room, "existing": random_existing_rooms}

	return render_template('index.html', vparams=params)

@app.route('/status/', methods=['GET'])
def getstaus():
    return 'We are on!'

def init():
	# Random words!
	app.words = open("/usr/share/dict/words").readlines()

	# Try reading persistence file
	try:
		app.rooms = pickle.load(open("db", "r"))
	except IOError as e:
		print "No db found"

	pusher.app_id = sys.argv[1];
	pusher.key = sys.argv[2];
	pusher.secret = sys.argv[3];
	app.p = pusher.Pusher()
	#persist()

def main():
	init()
	app.run(debug=True, host='0.0.0.0')

def create_app():
	init()
	return app

if __name__ == "__main__":
	main();