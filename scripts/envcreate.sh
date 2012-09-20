#!/bin/bash
# Run this a normal user in order go get all files setup needed for daemon 

cd /opt/shoutfb

touch shoutd
chmod a=rx shoutd

touch shoutd.log
chmod o+rw shoutd.log
 
