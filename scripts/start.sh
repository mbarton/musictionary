#!/bin/bash

cd /opt/shoutfb

. /opt/shoutfb/shoutfb/bin/activate

python server.fcgi 28046 383257af105f06f75f48 ca119b4d8e4385802d8d &> shoutd.log &

echo $! > /tmp/shoutd.pid

