#!/bin/bash

cd /opt/shoutfb

. /opt/shoutfb/shoutfb/bin/activate

python test.fcgi &> shoutd.log &

echo $! > /tmp/shoutd.pid

