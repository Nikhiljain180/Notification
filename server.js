var mongoose = require('mongoose'),
    express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http'),
    io = require('socket.io'),
    data = require('./server/data/notifications.json'),
    notification = require('./server/models/notification.server.model'),
    Notifications = mongoose.model('Notifications');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
var DB_HOST =process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost';
var dbConfig = {
    uri: 'mongodb://' + DB_HOST + '/fullstack-notification'
};

/*Set EJS template Engine*/
app.set('views','./client');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/client'));

io = io.listen(app.listen(3000, function() {
    console.info('Application started on port : 3000');
}));

function getNotificationsCount() {
    return Notifications.count({read:false}).exec();
}

function getNotifications() {
    return Notifications.find({read: false}).exec();
}

function insertNotifications() {
    var i = parseInt(Math.random() * data.length);
    Notifications.create(data[i], function(err, docs) {
        if (err) {
            console.info('Unable to save data : ', err);
        } else {
            console.info('Notifications were successfully stored');
        }
    });
}

var db = mongoose.connect(dbConfig.uri);
db.connection.on('open', function callback() {
    io.sockets.on('connection', function (socket) {

        function getUnreadNotification() {
            getNotificationsCount().then(function(count) {
                socket.emit('notificationCount', {count : count});
            });
        }

        setInterval(getUnreadNotification, 3000);

    });
});
insertNotifications();

setInterval(insertNotifications, 10000);


/*Render index.html as homepage*/
app.get('/',function(req,res) {
    res.render('index.html',{title:"Notification System"});
});

app.get('/notifications/count',function(req,res) {
    getNotificationsCount().then(function(count) {
        res.send({count: count});
    });
});

app.get('/notifications',function(req,res) {
    getNotifications().then(function(notifs) {
        res.send(notifs);
    });
});

