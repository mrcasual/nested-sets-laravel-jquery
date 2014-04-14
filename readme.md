# Nested sets with Laravel and jQuery

This is a quick implementation of nested sets using Laravel 4 and jQuery. Key features:

* Drag & drop sorting (using [jqTree](http://mbraak.github.io/jqTree/))
* In-place editing (using [X-editable](http://vitalets.github.io/x-editable/))
* Error notification and modal dialogs (using [Alertify](http://fabien-d.github.io/alertify.js/))
 
Under the hood, I rely on Aleksander Kalnoy's [nested set](https://github.com/lazychaser/laravel4-nestedset) package for Laravel that takes care of hierarchal data management.

# Demo

All operations are done without page refresh:

![implementation demo](https://raw.github.com/mrcasual/nested-sets-laravel-jquery/master/demo.gif)

# Installation

- Clone/download this repo
- Configure your MySQL database in ```./app/config/database.php```
- Run ``composer install``
- Run ```php artisan migrate```
* Launch the web server with ```php artisan serve``` and navigate to [localhost:8000](http://localhost:8000)

You may also wish to install [Node.js](nodejs.org) and [Grunt](http://gruntjs.com/). By default, JS and CSS assets are served concatenated and minified. Enter ```./public``` and run:

* ```npm install``` to fetch Grunt packages
* ```grunt``` to start the watch task

# Contact

Hit me up on Twitter: [@CasualMr](https://twitter.com/CasualMr)
