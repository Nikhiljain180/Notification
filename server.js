var mongoose = require('mongoose'),
    express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http'),
    io = require('socket.io'),
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

function getNotifications() {
    return Notifications.find({}).exec();
}

var db = mongoose.connect(dbConfig.uri);
db.connection.on('open', function callback() {
    io.sockets.on('connection', function (socket) {

        function getUnreadNotification() {
            getNotifications().then(function(notifs) {
                socket.emit('notification', notifs);
            });
        }

        setInterval(getUnreadNotification,60000);
    });
});


/*Render index.html as homepage*/
app.get('/',function(req,res){
    res.render('index.html',{title:"Notification System"});
});

app.get('/notifications',function(req,res){
    getNotifications().then(function(notifs) {
        res.send(notifs);
    });
});


