/**
 * Created by Neha on 1/12/2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var notificationSchema = new Schema({
    desc     : String,
    read: Boolean
});

mongoose.model('Notifications', notificationSchema, 'Notifications');
