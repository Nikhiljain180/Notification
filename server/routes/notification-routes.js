'use strict';

var unreadNotifications = [];

var notificationDao = require('./../dao/notification-dao');

module.exports = function(app) {

	/*Render index.html as homepage*/
	app.get('/', function(req, res) {
		res.render('index.html', {'title': 'Notification System'});
	});

	app.get('/notifications/count', function(req, res) {
		notificationDao.getNotificationsCount().then(function(count) {
			res.send({'count': count});
		});
	});

	app.get('/notifications', function(req, res) {
		console.info(req.data);
		console.info(req.query);
		var date = req.query.date;
		notificationDao.getNotifications(date).then(function(notifs) {
			unreadNotifications = notifs;
			res.send(notifs);
		});
	});

	app.put('/notifications/mark/read', function(req, res) {
		var notifIdList = unreadNotifications.map(function(notif) {
			return notif._id;
		});
		notificationDao.NotificationModel.update(
			{'_id': {'$in': notifIdList}},
			{'$set': {'read': true, 'updatedTimestamp': Date.now()}},
			{'multi': true}
		).exec().then(function(result) {
			res.send(result);
		});
	});

};
