# Notification

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:

* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager or yarn package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node

### Compiling Your Application

The first thing you should do is install the Node.js dependencies. The application comes pre-bundled with a package.json file that contains the list of modules you need to start your application.

* To install Node.js dependencies you're going to use npm again. In the application folder run this in the command-line:

```bash
$ npm install
```

OR

```bash
$ yarn install
```

* To run gulp tasks, you need to install Gulp globally. Use the following command:

```bash
$ npm install -g gulp-cli
```

### Running Your Application

* On Command Prompt inside your project home folder, write:

```bash
$ node server.js
```

OR

```bash
$ npm start
```

OR

```bash
$ yarn start
```

Your application should run on port 3000, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running by now.
_______________________

## About the Application

1. The application will show all the Notification which is in Mongo Db server (also find in data/notifications.js)

2. Getting all notification using socket between client and server side,Plese find all files are in server folder.

3. frontend files including HyperText and scripting files are in static folder.

4. used Mongo DB(Cloud side Mlab) for storing notification and also send from server to client side.
 
5. Gulp is working as task runner.

## Details implemented: 

It Have following things has implemented:
- The bell and the dropdown exactly as shown in above design.
- The bell should show number of new notifications (unread ones).
- Clicking on bell should show the dropdown with a nice animation and clicking again or clicking outside should close it.
- On opening the dropdown the new notification count should reset to 0.
- Create socket for push notification after given time interval.
- 90% of part in  vanilla javascript and ajax call are in Jquery.
- On page refresh, the notifications should be repopulated as it was last time(managing read notification in DataBase as well)

