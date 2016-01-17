'use strict';

require('./server/models/notification.server.model');
require('./server/models/user.server.model');

var Notifications = mongoose.model('Notifications'),
	Users = mongoose.model('Users');

function getNotificationsCount() {
	return Notifications.count({'read': false}).exec();
}

function getNotifications(date) {
	if (date) {
		return Notifications.find({'createdTimestamp': {'$lt': date}})
			.sort('-createdTimestamp')
			.limit(10)
			.populate('user')
			.exec();
	}

	return Notifications.find({'read': false})
		.sort('-createdTimestamp')
		.limit(10)
		.populate('user')
		.exec();
}


module.exports = {
	'NotificationModel': Notifications,
	'UsersModel': Users,
	'getNotificationsCount': getNotificationsCount,
	'getNotifications': getNotifications
};
