var mongoose = require('mongoose'),
    express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http'),
    io = require('socket.io'),
    data = require('./server/data/notifications.json'),
    notification = require('./server/models/notification.server.model'),
    Notifications = mongoose.model('Notifications'),
    users = require('./server/models/user.server.model'),
    Users = mongoose.model('Users');

var unreadNotifications = [];

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
    return Notifications.find({read: false}).populate('user').exec();
}

var db = mongoose.connect(dbConfig.uri);
db.connection.on('open', function callback() {
    io.sockets.on('connection', function (socket) {

        insertNotifications();
        setInterval(insertNotifications, 10000);

        function insertNotifications() {
            var i = parseInt(Math.random() * data.length);
            Notifications.create(data[i], function(err, docs) {
                if (err) {
                    console.info('Unable to save data : ', err);
                } else {
                    getUnreadNotification();
                }
            });
        }

        function getUnreadNotification() {
            getNotificationsCount().then(function(count) {
                socket.emit('notificationCount', {count : count});
            });
        }
    });
});

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
        unreadNotifications = notifs;
        res.send(notifs);
    });
});

app.get('/notifications/read', function(req, res) {
    var notifIdList = unreadNotifications.map(function(notif) {
        return notif._id;
    });
    console.info("notifIdList : ", notifIdList)
    Notifications.update(
        {_id: {$in : notifIdList}},
        {$set: {read: true}},
        {multi: true}
    ).exec().then(function(result) {
            res.send(result)
        });
});

