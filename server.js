var express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http'),
    io = require('socket.io'),
    mongoose = require('mongoose');

require('./server/models/notification.server.model');
require('./server/models/user.server.model');

var Notifications = mongoose.model('Notifications'),
    notificationCollection = require('./server/data/notifications.json');

var notificationController = require('./server/controllers/notification-controllers');

var DB_HOST = "notification:notification@ds163377.mlab.com:63377/notification",
    dbConfig = {
        'uri': 'mongodb://' + DB_HOST
    };

app.set('views', './client');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/client'));

io = io.listen(app.listen(3000, function() {
    console.info('Application started on port : 3000');
}));

var db = mongoose.connect(dbConfig.uri);
db.connection.on('open', function callback() {
    function getUnreadNotification() {
        notificationController.getNotificationsCount().then(function(count) {
            io.emit('notificationCount', {'count': count});
        });
    }

    function insertNotifications() {
        var i = parseInt((Math.random() * notificationCollection.length), 10);
        Notifications.create(notificationCollection[i], function(err, docs) {
            if (err) {
                console.error('Unable to save data : ', err);
            } else {
                getUnreadNotification();
            }
        });
        setTimeout(insertNotifications, 10000);
    }

    insertNotifications();

    io.sockets.on('connection', function() {
        console.log('A user is connected');
    });
});

require('./server/router/common-router')(app);

require('./server/router/notification-router')(app);
