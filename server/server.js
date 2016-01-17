'use strict';

var express = require('express'),
	app = express(),
	io = require('socket.io'),
	mongoose = require('mongoose');

var notificationCollection = require('./server/data/notifications.json');

var DB_HOST = process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost',
	dbConfig = {
		'uri': 'mongodb://' + DB_HOST + '/fullstack-notification'
	};

var notificationDao = require('./dao/notification-dao');

app.set('views', './client');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/client'));

io = io.listen(app.listen(3000, function() {
	console.info('Application started on port : 3000');
}));

var db = mongoose.connect(dbConfig.uri);
db.connection.on('open', function callback() {
	io.sockets.on('connection', function(socket) {

		function getUnreadNotification() {
			notificationDao.getNotificationsCount().then(function(count) {
				socket.emit('notificationCount', {'count': count});
			});
		}

		function insertNotifications() {
			var i = parseInt((Math.random() * notificationCollection.length), 10);
			notificationDao.NotificationModel.create(notificationCollection[i], function(err, docs) {
				if (err) {
					console.error('Unable to save data : ', err);
				} else {
					getUnreadNotification();
				}
			});
		}

		insertNotifications();
		setInterval(insertNotifications, 10000);

	});
});

require('./routes/notification-routes')(app);
