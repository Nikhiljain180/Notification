'use strict';

var mongoose = require('mongoose'),
	Notifications = mongoose.model('Notifications');

/* Queries the db to fetch the count of all unread notifications */
function getNotificationsCount() {
	return Notifications.count({'read': false}).exec();
}

/* Queries the db to fetch the unread notifications or the other 10 older notifications*/
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
