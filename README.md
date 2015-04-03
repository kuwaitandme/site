Kuwait and Me
=============

Kuwait and Me is a free online public classified site that aims to create a closer community in Kuwait. It is ad-free and is easy to use.

Documentation
-------------
To generate the documentation for the site you will have to make sure you have installed all the dependencies by running `npm install` and then starting a local server to serve the documentation files,

    $ npm install -g groc
    $ groc


Installing
----------
The sections below describe how to install a local version of the site on your machine. This is a very general guide which can be used (with a few changes) on any other project as well.

#### 1. Fulfill Dependencies
These are the requirements that are necessary to run the site locally on your machine. We recommend using a UNIX environment such as OSX or Linux, although there is support for Windows distributions.
* NodeJS runtime libraries
* MongoDB database
* MongoDB database
* Node package manager ([npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm))
* SASS css pre-processor ([sass](http://sass-lang.com/install))

    $ npm install -g mongodb pm2 redis gulp coffee-script

#### 2. Set up a local server
Simply place the project's folder inside of your server's html folder and access the site as you normally would access your server. In most cases the url to browse would be `http://localhost/kuwaitandme.com/www`.

If you encounter any problems with your serve not finding the site properly then modify the `kme_base_URL` in the [`www/index.php`](www/index.php) file as needed. Ideally it should contain the base url that will point to the `www` folder.

If you want to set up a virtual host, then linked here are sample scripts for [apache](src/conf/apache.conf)/[nginx](src/conf/nginx.conf). You must set the virtual host to point to the the `www` folder of this project.

#### 3. Set up a local Database
Create a new database in the MySQL server using the following details

Once created, populate the database schema by importing the [`populate.js`](server/db/populate.js) file. You can simply run this command to do so.

    mongo kuwaitandme ./

You can use a interface like [phpmyadmin](http://www.phpmyadmin.net/home_page/index.php) to perform the above operations. You can also copy-paste the following commands.

Execute the following commands in a MySQL shell to create the user and the database

    $ mysql

    mysql> CREATE DATABASE kuwaitandme;
    mysql> CREATE USER 'kme'@'localhost' IDENTIFIED BY 'kme';
    mysql> GRANT ALL PRIVILEGES ON kuwaitandme . * TO 'kme'@'localhost';
    mysql> FLUSH PRIVILEGES;

Then run these commands in a terminal to populate the database.

    $ mysql -u kme --password=kme -D kuwaitandme < www/codeigniter/db/schema.sql
    $ mysql -u kme --password=kme -D kuwaitandme < www/codeigniter/db/populate.sql


#### 4. Compiling front-end assets (CSS/JS)
Because of the nature of the CSS/JS files, the build files are never committed onto git. So to view the pages with the CSS/JS files you must compile them at least once.

For the first time, move to the source directory `cd src` and download the npm packages by typing in `npm install`. Once done compile the library files by typing in `grunt deploy`.

You will only do this once. After that, every time you will make a change to the CSS/JS files you will simply have to run `grunt` to compile the build files.

    $ cd src
    $ npm install
    $ grunt deploy
    $ cd ..