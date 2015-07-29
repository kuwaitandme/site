Installation Guide
==================
This doc gives instructions on how to install dependencies to have the app running in your machine.

## 0. Quick Start
If you don't want to read through all of the steps below, then we recommend simply setting up the project environment using [Vagrant](https://www.vagrantup.com/). We have created a box for you with all the dependencies installed

    # Install local dependencies
    npm install

    # Download and SSH into the box
    vagrant up; vagrant ssh

Once the above commands succeeds, you should have a shell inside of the box. Start the project by running the following commands inside the box.

    [vagrant@kuwaitandme ~]$ cd /vagrant
    [vagrant@kuwaitandme ~]$ npm run-script init-config
    [vagrant@kuwaitandme ~]$ npm start

Because of the shared folders, vagrant will share the current project files so you can easily edit the files and view the changes in the box itself. The box has been set to have the app running on port 6902 of your browser. [http://localhost:6902](http://localhost:6902)

If everything goes well, then you're all good to go. If however vagrant fails or you want to install the app in your own local environment, then we recommend following the instructions below given step by step. Most of it is setting up the different dependencies that is required for the app. 


## 1. Fulfill Dependencies
These are the requirements that are necessary to run the site locally on your machine. We recommend using a UNIX environment such as OSX or Linux, although there is support for Windows distributions.


#### 1.1 Core packages

Make sure you have the following programs installed in your machine.

 + [NodeJS](https://nodejs.org/) (The server)
 + [PostgreSQL](http://www.postgresql.org/) (Database)
 + [Redis](http://redis.io/) (A storage DB used for session)


#### 1.2 Global npm packages
For the project to run it requires some global programs from npm installed. Because our requirements can change a lot, we keep a [requirements file](etc/nodeenv.conf) which can be used to setup a nice virtual environment. 

The following two sub-section describe how to setup the global packages. **Choose only one of the options below**.


##### A. Setup using a virtual environment
We recommend setting up a local environment using [nodeenv](https://github.com/ekalinin/nodeenv) (Node's equivalent of virtualenv). 

    npm install -g nodeenv  # Install nodeenv
    nodeenv --requirements=./etc/nodeenv.conf .env # Setup Virtual environment

We also recommend creating a symlink for easier access.

    ln -s ./.env/bin/activate ./bin/activate

So now, all you have to do is run ``` source ./bin/activate ``` to enter into the virtual env. 
 

##### B. Setup without virtual environment (not recommended)
If you don't want to setup a virtual environment then simply install [bower](https://bower.io) and [coffee-script](http://coffeescript.org/) which is probably the only dependency you'll need. 

    npm install -g bower coffee-script # Not recommended


#### 1.3 Local npm packages
Now that you have the global dependencies installed, You can finally install the local dependencies with

    npm install
    bower install



## 2. Setup the database
The database is run on the PostgreSQL DB and the server uses [knex.js](http://knexjs.org) to communicate with the DB. You specify connection parameters inside knex's configuration file (knexfile.coffee).


#### 2.1 Setting up a DB user
Run these commands in a postgres shell. These commands create a simple database and a database user.

    -- Create a user 'kme_webmaster' with password 'password'
    CREATE ROLE kme_webmaster;
    ALTER  ROLE kme_webmaster with password 'password';
    ALTER  ROLE kme_webmaster WITH LOGIN;

    -- Create a database 'kuwaitandme' and give access only to 
    -- user 'kme_webmaster'
    CREATE            DATABASE kuwaitandme;
    REVOKE CONNECT ON DATABASE kuwaitandme FROM PUBLIC;
    GRANT  CONNECT ON DATABASE kuwaitandme TO kme_webmaster;
    GRANT  ALL     ON DATABASE kuwaitandme TO kme_webmaster;


Once done you should be able to get a shell by logging into Postgres by running

    psql -U kme_webmaster -d kuwaitandme -W

#### 2.2 Writing the configuration file
You can view [knexfile.sample.coffee](etc/config/knexfile.sample.coffee) which is a sample configuration file that can be used as reference. 

Fill up the DB details in a file called knexfile.coffee in the same directory.

    cp etc/config/knexfile.sample.coffee etc/config/knexfile.coffee
    vim etc/config/knexfile.coffee

The mode is decided using the value stored in the ```NODE_ENV``` environment variable. Set the fields accordingly

#### 2.3 Populating the DB
Knex is amazing with its support for database migrations. Migration commands to update the tables have been written as custom scripts in the [package.json](package.json) file.

    npm run-script schema-up # Add the schemas
    npm run-script seed # Seed the DB


<!-- /#### 3. Compile Assets -->

## 3. Configure the server
The site was built using [igloo](https://www.npmjs.com/package/igloo) which keeps two kinds of configuration files. 

Read more about how [igloo builds its configuration file](https://github.com/niftylettuce/igloo/blob/master/lib/boot/settings.js). Basically write all your changes in a separate file called ```etc/config/local.coffee```. This file will overwrite any settings provided in ```etc/config/config.coffee``` and will also be ignored by git.

A sample file has been provided for you [```etc/config/local.sample.coffee```](etc/config/local.sample.coffee) for reference

    cp  etc/config/local.sample.coffee etc/config/local.coffee
    vim etc/config/local.coffee


## 4. Setup a virtual host (Optional)
There are a lot of tutorial on how to setup your own virtual host. We recommend finding one which lets you use SSL and proxy forwarding.

Create two virtual hosts, one used to serve static files and the other to proxy to the app. The app can be configured to create URLs to contain the static server's URL so that static content can be served directly from the static server instead. The static server can then run behind a CDN cache like [CloudFlare](https://www.cloudflare.com) to serve files faster.

Our servers run on [nginx](http://nginx.org/), so we have left a [sample configuration file](etc/nginx.conf) which can be used as reference. Note that this configuration uses a SSL certificate which you can generate by yourself or get one online.


## 5. Compile frontend assets
Because of the nature of the asset files, they are never committed onto git. So to view the site properly, you must compile them at least once.

All frontend files are compiled using [gulp](https://gulpjs.com). There are different options you can choose from while compiling with gulp.

  + To build files and watch for changes use ``` gulp ```
  + To build files only use ```gulp build```
  + To build files and minify (for production) use ```gulp deploy ```


## 6. YAAAY!!! Congratulations!
Good job! The app is all set to run now.

    NODE_ENV=production npm start # For production 
    nodeenv -w src/server         # For development

I know this readme is just too long, but I'm more than happy to take suggestions from anyone how would like to share on ways to shorten the installation process or at the very least this doc ;).
