#!/bin/bash

supervisor -i . server.js > /dev/stdout
# Need this here to keep the docker container running
/bin/bash
tail -f /dev/null