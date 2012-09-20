from flup.server.fcgi import WSGIServer
from server import create_app 

if __name__ == '__main__':
    application = create_app()
    WSGIServer(application, bindAddress='/tmp/shoutfb-fcgi.sock').run()