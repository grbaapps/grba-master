

# [AngularJS](http://www.angularjs.org/) GRBA Web App with Node.JS backend

***

## Purpose

Building GRBA web application as a sungle page Angular (SPA) application with Node.JS backend.

## TODO List
* Add routes to go to different pages from header - Abhishek
* Refactor index.html to use views instead of ng-include - Abhishek
* Review Angularjs code and refactor as needed - Abhishek - reviewed by Surajit
* Refactor server/registration code - Pritam
* Add more fields to client/src/html/registration.html to send to backend - Abhishek
* Setup json data for Saraswati Puja 2017 event
* Change client/dist/html/event.html to consume json data
* Update client/src/html/sponsor.html with the correct data
* Stretch - Add bower to manage client dependencies - Abhishek
* Stretch - Add gulpfile.js - Abhishek
* New Registration functionality (POST only) - Pritam
* Define New Registration POST spec in github - Pritam
* Validation of input data for Registration service POST - Pritam
* Log framework for service layer - Pritam
* Exception handling - Pritam



## Stack with the right data - Ashish?

* Persistence store: [PostgreSQL](https://www.postgresql.org/)
* Backend: [Node.js](http://nodejs.org/)
* Awesome [AngularJS](http://www.angularjs.org/) on the client
* CSS based on [Twitter's bootstrap](http://getbootstrap.com/)
* UI is based on jQuery [jQuery](https://jquery.com/)

Angular comes with a light version of jQuery. We load jQuery full version before Angular and Angular stops loading the light version and uses
the full version.

### Build

It is a complete project with a build system focused on AngularJS apps and tightly integrated with other tools commonly used in the AngularJS community:
* powered by [Grunt.js](http://gruntjs.com/)
* test written using [Jasmine](http://jasmine.github.io/) syntax
* test are executed by [Karma Test Runner](http://karma-runner.github.io/0.8/index.html) (integrated with the Grunt.js build)
* build supporting JS, CSS and AngularJS templates minification
* [Twitter's bootstrap](http://getbootstrap.com/) with LESS templates processing integrated into the build
* [Travis-CI](https://travis-ci.org/) integration
* PostgreSQL access is configured to use pg-promise package [pg-promise](https://www.npmjs.com/package/pg-promise)

## Installation

### Platform & tools

You need to install Node.js and then the development tools. Node.js comes with a package manager called [npm](http://npmjs.org) for installing NodeJS applications and libraries.
* [Install node.js](http://nodejs.org/download/) (Use node.js version 6.9.1)
* Install Grunt-CLI and Karma as global npm modules:

    ```
    npm install -g grunt-cli karma
    ```

(Note that you may need to uninstall grunt 0.3 globally before installing grunt-cli)

### Get the Code

Either clone this repository or fork it on GitHub and clone your fork:

```
git clone https://github.com/grba/grba-master.git
cd grba-master
```

### App Server

Our backend application server is a NodeJS application that relies upon some 3rd Party npm packages.  You need to install these:

* Install local dependencies (from the project root folder):

    ```
    cd server
    npm install
    cd ..
    ```

  (This will install the dependencies declared in the server/package.json file)

### Client App

Our client application is a straight HTML/Javascript application but our development process uses a Node.js build tool
[Grunt.js](gruntjs.com). Grunt relies upon some 3rd party libraries that we need to install as local dependencies using npm.

* Install local dependencies (from the project root folder):

    ```
    cd client
    npm install
    cd ..
    ```

  (This will install the dependencies declared in the client/package.json file)

## Building

### Configure Server
The server stores its data in a PostgreSQL database.
*
* Edit `server/config.js` to set database connection properties for the database you created.

    ```
    postgres: {
        dbUrl: 'postgres://username:password@host:port/database',             
    },

    ```

* Run our initialization script to initialize the database with a first admin user.

    ```
    node server/initDB.js // Not implemnented yet.
    ```

### Build the client app
The app made up of a number of javascript, css and html files that need to be merged into a final distribution for running.  We use the Grunt build tool to do this.
* Build client application:

    ```
    cd client
    grunt build
    cd ..
    ```

*It is important to build again if you have changed the client configuration as above.*

## Running
### Start the Server
* Run the server

    ```
    cd server
    node server.js
    cd ..
    ```
* Browse to the application at [http://localhost:8888]

## Browser Support
IE, Edge, Chrome, Firefox and Safari.

## Development

### Folders structure
At the top level, the repository is split into a client folder and a server folder.  The client folder contains all the client-side AngularJS application.  The server folder contains a very basic Express based webserver that delivers and supports the application.
Within the client folder you have the following structure:
* `node_modules` contains build tasks for Grunt along with other, user-installed, Node packages
* `dist` contains build results
* `src` contains application's sources
* `test` contains test sources, configuration and dependencies
* `vendor` contains external dependencies for the application

### Default Build
The default grunt task will build (checks the javascript (lint), runs the unit tests (test:unit) and builds distributable files) and run all unit tests: `grunt` (or `grunt.cmd` on Windows).  The tests are run by karma and need one or more browsers open to actually run the tests.
* `cd client`
* `grunt`
* Open one or more browsers and point them to [http://localhost:8888/__test/].  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

### Continuous Building
The watch grunt task will monitor the source files and run the default build task every time a file changes: `grunt watch`.

### Build without tests
If for some reason you don't want to run the test but just generate the files - not a good idea(!!) - you can simply run the build task: `grunt build`.

### Building release code
You can build a release version of the app, with minified files.  This task will also run the "end to end" (e2e) tests.
The e2e tests require the server to be started and also one or more browsers open to run the tests.  (You can use the same browsers as for the unit tests.)
* `cd client`
* Run `grunt release`
* Open one or more browsers and point them to [http://localhost:8888/__test/].  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

### Continuous testing
You can have grunt (karma) continuously watch for file changes and automatically run all the tests on every change, without rebuilding the distribution files.  This can make the test run faster when you are doing test driven development and don't need to actually run the application itself.

* `cd client`
* Run `grunt test-watch`.
* Open one or more browsers and point them to [http://localhost:8888/__test/].
* Each time a file changes the tests will be run against each browser.
