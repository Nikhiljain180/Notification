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

var db = mongoose.connect(dbConfig.uri);
db.connection.on('open', function callback() {
    io.sockets.on('connection', function (socket) {

        /*Event Handlers*/
        socket.on('subscription', function (obj) {
            User.findOne({_id:obj.user})
                .populate('subscriptions.subscriptionType')
                .populate('subscriptions.characterId')
                .exec()
                .then(function(subs){
                    console.info('hereeeeee.... ', subs);
                    socket.emit('subscription', {subs: subs});

                });
        });

        socket.on('notification', function(obj) {
            var collection = mongoose.connection.db.collection('Activities');
             /*Create tailable cursor for Activities collection*/
            var stream = collection.find({}, {
                tailable: true,
                awaitdata: true,
                numberOfRetries: Number.MAX_VALUE
            }).stream();

            stream.on('data', function(activity) {
                var actObj = activity;
                if(activity.read === false && activity.type == obj.typeId && activity.characterId == obj.characterId) {
                    socket.emit('notify', {obj:activity});
                    actObj.read = true;
                    Activities.update({_id:activity._id}, actObj, function(a, b){});
                }
            });

            stream.on('error', function(val) {
                console.log('Error: %j', val);
            });

            stream.on('end', function(){
                console.log('End of stream');
            });
        });
    });
});

/*Render index.html as homepage*/
app.get('/',function(req,res){
    res.render('index.html',{title:"Notification System"});
});


