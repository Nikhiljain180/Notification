'use strict';

var mongoose = require('mongoose'),
	Notifications = mongoose.model('Notifications');

function getNotificationsCount() {
	return Notifications.count({'read': false}).exec();
}

function getNotifications(date) {
	var promise;
	if (date) {
		promise = Notifications.find({'createdTimestamp': {'$lt': date}})
			.sort('-createdTimestamp')
			.limit(10)
			.populate('user')
			.exec();
	} else {
		promise = Notifications.find({'read': false})
			.sort('-createdTimestamp')
			.limit(10)
			.populate('user')
			.exec();
	}
	return promise;
}

module.exports = {
	'getNotificationsCount': getNotificationsCount,
	'getNotifications': getNotifications
};
