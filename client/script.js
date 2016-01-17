var notification = {
	'getCount': function() {
		$.ajax({
			'url': '/notifications/count',
			'success': function(count) {
				//update the notification count
				notification.update(count);
			},
			'error': function(err) {
				console.info('error : ', err);
			}
		});
	},
	'get': function(dateTimestamp) {
		$('.loader').removeClass('hide');
		$.ajax({
			'url': '/notifications',
			'data': {
				'date': dateTimestamp ? dateTimestamp: undefined
			},
			'success': function(notifs) {
				notification.markAsRead(notifs);

				//update the notification count
				notification.renderList(notifs);
			},
			'error': function(err) {
				console.info('error : ', err);
			},
			'complete': function() {
				$('.loader').addClass('hide');
			}
		});
	},
	'markAsRead': function(notifs) {
		$.ajax({
			'url': '/notifications/mark/read',
			'type': 'PUT',
			'success': function(count) {

				//update the notification count
				notification.update(count);
			},
			'error': function(err) {
				console.info('error : ', err);
			}
		});
	},
	'update': function(notifs) {
		if (notifs.count > 0 && !$('.notif-container').hasClass('open')) {
			$('.notification .main-count').removeClass('hide');
			var node = document.getElementsByClassName('main-count');
			console.info(node);
			if (notifs.count < 100) {
				for (var i = 0; i < node.length; i++) {
					node[i].innerHTML = notifs.count;
				}

			} else if (notifs.count > 0) {
				for (var j = 0; j < node.length; j++) {
					node[j].innerHTML = '99+';
					node[j].style.fontSize = '9px';
					node[j].style.lineHeight = '20px';
				}
			}
		}
	},
	'init': function() {
		var socket;

		notification.getCount();

		socket = io.connect();
		socket.on('notificationCount', function(count) {

			//update the notification count
			notification.update(count);
			if ($('.notif-container').hasClass('open')) {
				notification.get();
			}
		});
	},
	'togglePanel': function(e) {
		if (!$('.notif-container').hasClass('open')) {
			notification.get();
		}
		$('.notif-container').toggleClass('open');
		$('.notification .main-count').toggleClass('hide');
	},
	'renderList': function(notifs) {
		$('.notification .main-count').addClass('hide');
		var notifDOM = document.getElementsByClassName('list')[0];
		if (notifs.length) {
			$('.notif-container .main-count').removeClass('hide');
			notification.removeOldList(notifDOM, notifs.length);
			$('.list-item').addClass('read');

			notifs.forEach(function(notif) {
				var notifTime = notification.formatDatetime(notif.createdTimestamp);
				var listNode = document.createElement('div');
				listNode.setAttribute('data-date', notif.createdTimestamp);
				listNode.className = 'list-item pa-l';
				var userImg = document.createElement('img');
				userImg.className = 'pull-left';
				userImg.src = 'static/img/'+ notif.user.imgName;
				var contentDiv = document.createElement('div');
				contentDiv.className = 'content';
				contentDiv.innerHTML = '<span>'+ notif.user.firstName + ' </span>' + notif.desc;
				var timeDiv = document.createElement('div');
				timeDiv.className = 'notif-time';
				timeDiv.innerText = notifTime;
				listNode.appendChild(userImg);
				listNode.appendChild(contentDiv);
				listNode.appendChild(timeDiv);

				notifDOM.insertBefore(listNode, notifDOM.childNodes[1]);
			});
		} else {
			$('.list-item').addClass('read');
			$('.notif-container .main-count').addClass('hide');
		}
	},
	'removeOldList': function(notifDOM, newNotifsLen) {
		if (notifDOM.children.length + newNotifsLen > 10) {
			if (newNotifsLen > 10) {
				$(notifDOM).find('.list-item').slice(0).remove();
			} else {
				$(notifDOM).find('.list-item').slice(10-newNotifsLen).remove();
			}
		}
	},
	'formatDatetime': function(dateTime) {
		var date= new Date(dateTime);
		var year = date.getFullYear(),
			month = date.getMonth() + 1, // months are zero indexed
			day = date.getDate(),
			hour = date.getHours(),
			minute = date.getMinutes(),
			second = date.getSeconds(),
			hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
			minuteFormatted = minute < 10 ? '0' + minute : minute,
			morning = hour < 12 ? 'am' : 'pm';

		return month + '/' + day + '/' + year + ' ' + hourFormatted + ':' +
			minuteFormatted + morning;
	}
};

$(document).ready(function() {
	notification.init();

	$(document).click(function() {
		$('.notif-container').removeClass('open');
	});

	$('.notification, .notif-container').click(function(e) {
		e.stopPropagation();
	});

	$('.list').scroll(function() {
		if ($(this)[0].scrollHeight - $(this).scrollTop() === $(this).outerHeight()) {
			notification.get($(this).find('.list-item').last().attr('data-date'));
		}
	});
});
