#!/bin/bash
tmp=`mktemp -d`
pwd=`pwd`

# Download nodeenv into a temporary directory
git clone  --depth 1 https://github.com/ekalinin/nodeenv.git $tmp
chmod +x $tmp/nodeenv.py

# Create the virtual env using our configuration file
$tmp/nodeenv.py --requirements=$pwd/etc/nodeenv.conf $pwd/.env

# Create the symbolic link
ln -s $pwd/.env/bin/activate $pwd/bin/activate

echo
echo The virtual environment has been setup! Use this command to setup the
echo environment
echo -e '\t $ source bin/activate'
echo
echo While the global npm dependecies are taken careof, you need to make
echo sure that other global [non-npm] dependecies are also installed.
echo Find out how to install the following packages in your system:
echo -e '\t nginx - 1.8.0'
echo -e '\t postgres - 9.4.1'
echo -e '\t redis - 3.0.1'
echo
echo Once installed continue to install the project specific packages by
echo running:
echo -e '\t $ npm install'
echo -e '\t $ bower install'
echo
echo NOTE: node-gyp will throw an error at you if you use python 3.7. An easy
echo fix will be to make sure you have python 2.7 installed and run
echo -e '\t $ npm config set python python2.7'
echo
echo Then build the client files and start the server
echo -e '\t $ gulp deploy'
echo -e '\t $ npm start'
echo
echo AUTHOR: Steven Enamakel