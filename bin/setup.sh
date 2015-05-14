#!/bin/bash
tmp=`mktemp -d`
pwd=`pwd`

# Download nodeenv into a temporary directory
git clone  --depth 1 https://github.com/ekalinin/nodeenv.git $tmp
chmod +x $tmp/nodeenv.py

# Create the virtual env using our configuration file
$tmp/nodeenv.py --requirements=$pwd/etc/nodeenv.conf $pwd/.env