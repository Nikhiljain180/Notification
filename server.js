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

function getNotifications(date) {
    if(date) {
        return Notifications.find({"createdTimestamp": {$lt: date}}).sort('-createdTimestamp').limit(10).populate('user').exec();
    } else {
        return Notifications.find({read: false}).sort('-createdTimestamp').limit(10).populate('user').exec();
    }
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
    console.info(req.data);
    console.info(req.query);
    var date = req.query.date;
    getNotifications(date).then(function(notifs) {
        unreadNotifications = notifs;
        res.send(notifs);
    });
});

app.put('/notifications/mark/read', function(req, res) {
    var notifIdList = unreadNotifications.map(function(notif) {
        return notif._id;
    });
    Notifications.update(
        {_id: {$in : notifIdList}},
        {$set: {read: true, updatedTimestamp: Date.now()}},
        {multi: true}
    ).exec().then(function(result) {
            res.send(result)
        });
});

