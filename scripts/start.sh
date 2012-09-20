#!/bin/bash

cd /opt/shoutfb

. /opt/shoutfb/shoutfb/bin/activate

python server.fcgi 1 2 3 &> shoutd.log &

echo $! > /tmp/shoutd.pid

