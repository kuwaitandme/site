Kuwait and Me
=============

Kuwait and Me is a free online public classified site that aims to create a closer community in Kuwait. It is completely non-profit, ad-free and is easy to use. It is fully open-sourced under the GNU license and out-does any other classified site.


Contribute
----------
Everyone is encouraged to contribute to the site no matter what their specialty is. If you think you there is something you can make better, it is very easy for you do to so.

For more information about contributing, read the [CONTRIBUTING](CONTRIBUTING.md) file.


Bug reports & Feature Suggestions
---------------------------------
If you find a bug or have a feature that you want to suggest, you can do so by either submitting an issue on GitHub, or by sending an email to me@steven.pw. Read this guide on [how to submit issues](https://guides.github.com/features/issues/).


Installing
----------
The sections below describe how to install a local version of the site on your machine. This is a very general guide which can be used (with a few changes) on any other project as well.

#### 1. Fulfill Requirements
These are the requirements that are necessary to run the site locally on your machine. We recommend using a UNIX environment such as OSX or Linux, although there is support for Windows distributions.

* Web server with PHP installed
* MySQL database
* Node package manager ([npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm))
* Grunt Command line interface ([grunt-cli](http://gruntjs.com/getting-started))
* SASS css pre-processor ([sass](http://sass-lang.com/install))

#### 2. Set up a local server
Simply place the project's folder inside of your server's html folder and access the site as you normally would access your server. In most cases the url to browse would be `http://localhost/kuwaitandme.com/www`.

If you encounter any problems with your serve not finding the site properly then modify the `kme_base_URL` in the [`www/index.php`](www/index.php) file as needed. Ideally it should contain the base url that will point to the `www` folder.

If you want to set up a virtual host, then linked here are sample scripts for [apache](src/conf/apache.conf)/[nginx](src/conf/nginx.conf). You must set the virtual host to point to the the `www` folder of this project.

#### 3. Set up a local Database
Create a new database in the MySQL server using the following details

    Database Name: kuwaitandme
    Username: kme
    Password: kme


Once created, import the database schema by importing the [`schema.sql`](www/codeigniter/db/schema.sql) file. Then populate the tables by importing the [`populate.sql`](www/codeigniter/db/populate.sql) file.

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