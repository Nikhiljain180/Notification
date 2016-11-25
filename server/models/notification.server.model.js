/**
 * Created by Nikhil on 11/24/2016.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var notificationSchema = new Schema({
	'user': {
		'type': Schema.Types.ObjectId,
		'ref': 'Users'
	},
	'desc': String,
	'read': Boolean,
	'createdTimestamp': {
		'type': Date,
		'default': Date.now
	}
});

mongoose.model('Notifications', notificationSchema, 'Notifications');
