'use strict';

var mongoose = require('mongoose'),
    Notifications = mongoose.model('Notifications');

function getNotificationsCount() {
    return Notifications.count({read: false}).exec();
}

function getNotifications(date) {
    if (date) {
        return Notifications.find({"createdTimestamp": {$lt: date}})
            .sort('-createdTimestamp')
            .limit(10)
            .populate('user')
            .exec();
    } else {
        return Notifications.find({read: false})
            .sort('-createdTimestamp')
            .limit(10)
            .populate('user')
            .exec();
    }
}

module.exports = {
    "getNotificationsCount": getNotificationsCount,
    "getNotifications": getNotifications
};