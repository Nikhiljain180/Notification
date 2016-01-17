'use strict';

var unreadNotifications = [];

var mongoose = require('mongoose'),
    Notifications = mongoose.model('Notifications');

var notificationController = require('./../controllers/notification-controllers');

module.exports = function(app) {
    app.get('/notifications/count', function (req, res) {
        notificationController.getNotificationsCount().then(function (count) {
            res.send({count: count});
        });
    });

    app.get('/notifications', function (req, res) {
        console.info(req.data);
        console.info(req.query);
        var date = req.query.date;
        notificationController.getNotifications(date).then(function (notifs) {
            unreadNotifications = notifs;
            res.send(notifs);
        });
    });

    app.put('/notifications/mark/read', function (req, res) {
        var notifIdList = unreadNotifications.map(function (notif) {
            return notif._id;
        });
        Notifications.update(
            {_id: {$in: notifIdList}},
            {$set: {read: true, updatedTimestamp: Date.now()}},
            {multi: true}
        ).exec().then(function (result) {
            res.send(result)
        });
    });

};