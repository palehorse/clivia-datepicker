(function( factory ) {
	if (typeof(require) === 'function') {
		module.exports = factory(jQuery);
	} else {
		factory(jQuery);
	}
})(function( $ ) {
	var _duration = 150;
	
	$.fn.datepicker = function(params, value) {
		var _this = this, _defaults = {},
			_datetime = _this.val(),
			_year = _datetime != '' ? parseInt(_datetime.split(' ')[0].split('-')[0]) : (new Date()).getFullYear(),
			_month = _datetime != '' ? parseInt(_datetime.split(' ')[0].split('-')[1]) : (new Date()).getMonth() + 1,
			_date = _datetime != '' ? parseInt(_datetime.split(' ')[0].split('-')[2]) : (new Date()).getDate(),
			_hours = _datetime != '' ? _datetime.split(' ')[1].split(':')[0] : '00',
			_minutes = _datetime != '' ? _datetime.split(' ')[1].split('-')[1] : '00',
			_week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			_monthTitle = $('<div class="clivia-calendar-month-title"><a href="" class="clivia-calendar-last-month">&lang;</a><h5 class="clivia-calendar-month"></h5><a href="" class="clivia-calendar-next-month">&rang;</a></div>'),
			_calendarPanel = $('<div class="clivia-calendar-panel"></div>'),
			_calendarContainer = $('<div class="clivia-calendar-container"></div>'),
			_weekContainer = $('<div class="clivia-calendar-week-container"></div>'),
			_timeContainer = $('<div class="clivia-calendar-time-container"></div>');

			function _formatDate(year, month, date, format) {
				if (typeof format === 'undefined') format = 'yyyy-mm-dd';
				var str = '',
					matchReg = /yyyy(.*)mm(.*)dd/,
					matches = format.match(matchReg),
					signs = (matches && matches.length > 1) ? matches.slice(1) : [];

				if (!signs || !signs.length) return;
				if (isNaN(parseInt(year)) || isNaN(parseInt(month)) || isNaN(parseInt(date))) return;
				if (!parseInt(year) || !parseInt(month) ||!parseInt(date)) return;
				if (year) {
					str = year;
				}

				if (month < 10) {
					month = '0' + month;
					
				}
				
				str += signs[0] + month;
				
				if (date < 10) {
					date = '0' + date;
				}

				str += signs[1] + date;

				return str;
			}
		
			function _checkFormat(date, format) {
				var reg = /yyyy(.*)mm(.*)dd/,
					matches = format.match(reg),
					signs = (typeof matches === 'object' && matches.length == 3) ? matches.slice(1) : [],
					dateMatches = date.match(/(\d{4}).*(\d{2}).*(\d{2})/),
					dates = (typeof dateMatches === 'object' && dateMatches.length === 4) ? dateMatches.slice(1) : [];
		
				if (!signs || !signs.length) return false;
				if (!dateMatches || !dateMatches.length) return false;
				if (!dates || !dates.length) return false;
				if (date != dates[0] + signs[0] + dates[1] + signs[1] + dates[2]) return false;
				return true;
			}
		
			function _focusDate(ceil) {
				var currentFocusCeil = $('.clivia-date-focus-ceil');
				if (currentFocusCeil.length) {
					currentFocusCeil.removeClass('clivia-date-focus-ceil');
					switch (true) {
						case currentFocusCeil.hasClass('clivia-date-this-month'):
							currentFocusCeil.css({
								backgroundColor: '#F5F5F5',
								color: '#000',
							});
							break;
						case currentFocusCeil.hasClass('clivia-date-last-month'):
						case currentFocusCeil.hasClass('clivia-date-next-month'):
							currentFocusCeil.css({
								backgroundColor: '#fff',
								color: '#ABABAB',
							});
							break;
					}
				}
				
				ceil.addClass('clivia-date-focus-ceil');
				ceil.css({
					backgroundColor: '#878787',
					color: '#fff',
				});
			}
		
			function _calculateDate(year, month, count, format, callback) {
				var status = '',
					firstDate = _formatDate(year, month, 1, format),
					lastDate = _formatDate(year, month, (new Date(year, month, 0)).getDate(), format);
		
				if (count <= (new Date(firstDate)).getDay()) {
					thisDate = ((new Date(year, month - 1, 0)).getDate() + (count - (new Date(firstDate)).getDay()));
					status = 'lastMonth';
				} else {
					if (count <= (new Date(firstDate)).getDay() + (new Date(year, month, 0)).getDate()) {
						thisDate = count - (new Date(firstDate)).getDay();
						status = 'thisMonth';
					} else {
						thisDate = count - (new Date(firstDate)).getDay() - (new Date(year, month, 0)).getDate();
						status = 'nextMonth';
					}
				}
		
				if (typeof callback === 'function') {
					callback.call(null, count, thisDate, status);
				}
			}
		
			function _setCalendarCeil(year, month, date, format) {
				var total = ((new Date(_formatDate(year, month, 1, format))).getDay()) + (6 - (new Date(_formatDate(year, month, (new Date(year, month, 0)).getDate(), format))).getDay()) + (new Date(year, month, 0)).getDate(),
					currentDate = _formatDate(year, month, date, format);

				for (var i=1; i<=total; i++) {
					_calculateDate(year, month, i, format, function(count, date, status) {
						var ceil = $('<div class="clivia-calendar-date-ceil"></div>').css({display:'inline-block',width:33,height:26,textAlign:'center',padding:2,cursor:'pointer'});
						switch (status) {
							case 'thisMonth':
								ceil.data('clivia-date-value', _formatDate(year, month, date, format));
								ceil.addClass('clivia-date-this-month');
								ceil.css({
									backgroundColor: '#F5F5F5',
									color: '#000',
								});
								break;
							case 'lastMonth':
								ceil.data('clivia-date-value', _formatDate((month == 1 ? year - 1 : year), (month == 1 ? 12 : month - 1), date, format));
								ceil.addClass('clivia-date-last-month');
								ceil.css({
									backgroundColor: '#fff',
									color: '#ABABAB',
								});
								break;
							case 'nextMonth':
								ceil.data('clivia-date-value', _formatDate((month == 12 ? year + 1 : year), (month == 12 ? 1 : month + 1), date, format));
								ceil.addClass('clivia-date-next-month');
								ceil.css({
									backgroundColor: '#fff',
									color: '#ABABAB',
								});
								break;
						}
		
						if (currentDate == ceil.data('clivia-date-value')) {
							var datetime = _this.val();
							_focusDate(ceil);
							
							if (datetime != '') {
								_this.val(ceil.data('clivia-date-value') + ' ' + datetime.split(' ')[1]);
							}
						}
		
						ceil.css({borderRight: '1px solid #BFBFBF'});
						if (count % 7 == 1) {
							ceil.css({borderLeft: '1px solid #BFBFBF'});
						}
						ceil.css({borderBottom: '1px solid #BFBFBF'});
						if (count <= 7) {
							ceil.css({borderTop: '1px solid #BFBFBF'});
						}
		
						ceil.html(thisDate);
						ceil.appendTo(_calendarContainer);
					});
				}
			}
		
			function _setCalendarPanel(year, month, date, hours, minutes, format) {
				_calendarPanel.find('.clivia-calendar-month-title .clivia-calendar-month').text(year + '年' + month + '月');
				_setCalendarCeil(year, month, date, format);

				_calendarPanel.css({
					width: 266,
					textAlign: 'center',
				});
		
				_calendarPanel.find('a.clivia-calendar-last-month')
							 .off('click')
							 .on('click', function(e) {
								 e.preventDefault();
								 _calendarPanel.find('.clivia-calendar-date-ceil').remove();
								   month = (month - 1 > 0) ? month - 1 : 12;
								   year = (month == 12) ? year - 1 : year;
								   _setCalendarPanel(year, month, date, hours, minutes, format);
							 });
		
				_calendarPanel.find('a.clivia-calendar-next-month')
							 .off('click')
							 .on('click', function(e) {
								e.preventDefault();
							    _calendarPanel.find('.clivia-calendar-date-ceil').remove();
								month = (month + 1 > 12) ? month - 11 : month + 1;
								year = (month == 1) ? year + 1 : year;
								_setCalendarPanel(year, month, date, hours, minutes, format);
							 });
		
				_calendarPanel.find('.clivia-calendar-date-ceil')
							 .off('click')
							 .on('click', function(e) {
								e.preventDefault();
								var datetime = _this.val();

								_focusDate($(this));
								if (datetime != '') {
									_this.val($(this).data('clivia-date-value') + ' ' + datetime.split(' ')[1]);
								} else {
									_this.val($(this).data('clivia-date-value') + ' ' + '00:00');
								}
							 });

				_timeContainer.find('.hours').text(hours);
				_timeContainer.find('.minutes').text(minutes);
			}
		
			function _setValue(value) {
				var datetime = value.split(' '),
					hours = datetime[1].split(':')[0],
					minutes = datetime[1].split(':')[1];

				_this.val(value);
				_this.next('.clivia-calendar-panel').find('.clivia-calendar-date-ceil').each(function() {
					var ceilValue = $(this).data('clivia-date-value');
					if (ceilValue == datetime[0]) {
						_focusDate($(this));
					}
				});

				_timeContainer.find('h4.hours').text(hours);
				_timeContainer.find('h4.minutes').text(minutes);
			}
		
			function _setTimer() {
				_timeContainer.find('.btn-increase-hour')
							 .off('click')
							 .on('click', function(e) {
								e.preventDefault();
								
								var hours = parseInt(_timeContainer.find('h4.hours').text()),
									times = _this.val().split(' ');
								hours = hours < 23 ? hours+1 : 0;
								
								_timeContainer.find('h4.hours').text(hours < 10 ? '0' + hours : hours);
								_this.val(times[0] + ' ' + _timeContainer.find('h4.hours').text() + ':' + _timeContainer.find('h4.minutes').text());
							  });
							  
				_timeContainer.find('.btn-decrease-hour')
							  .off('click')
							  .on('click', function(e) {
								  e.preventDefault();
		
								  var hours = parseInt(_timeContainer.find('h4.hours').text()),
								  times = _this.val().split(' ');
								  hours = hours > 0 ? hours-1 : 23;
		
								  _timeContainer.find('h4.hours').text(hours < 10 ? '0' + hours : hours);
								  _this.val(times[0] + ' ' + _timeContainer.find('h4.hours').text() + ':' + _timeContainer.find('h4.minutes').text());
							  });
		
				_timeContainer.find('.btn-increase-minutes')
							  .off('click')
							  .on('click', function(e) {
								 e.preventDefault();
								 
								 var minutes = parseInt(_timeContainer.find('h4.minutes').text()),
								 times = _this.val().split(' ');
								 minutes = minutes < 59 ? minutes+1 : 0;
								 
								 _timeContainer.find('h4.minutes').text(minutes < 10 ? '0' + minutes : minutes);
								 _this.val(times[0] + ' ' + _timeContainer.find('h4.hours').text() + ':' + _timeContainer.find('h4.minutes').text());
							   });
		
				_timeContainer.find('.btn-decrease-minutes')
							   .off('click')
							   .on('click', function(e) {
								  e.preventDefault();
								  
								  var minutes = parseInt(_timeContainer.find('h4.minutes').text()),
								  times = _this.val().split(' ');
								  minutes = minutes > 0 ? minutes-1 : 59;
								  
								  _timeContainer.find('h4.minutes').text(minutes < 10 ? '0' + minutes : minutes);
								  _this.val(times[0] + ' ' + _timeContainer.find('h4.hours').text() + ':' + _timeContainer.find('h4.minutes').text());
								});
			}
		
			function _show() {
				_this.next('.clivia-calendar-panel').fadeIn(_duration);
			}
		
			function _hide() {
				_this.next('.clivia-calendar-panel').fadeOut(_duration);
			}

		if (typeof params === 'string') {
			if (typeof _this.data('clivia-params') === 'object') $.extend(_defaults, _this.data('clivia-params'));
			switch (params) {
				case 'set':
					_setValue.call(null, value);
					break;
				case 'show':
					_show.call(null, _this);
					break;
				case 'hide':
					_hide.call(null, _this);
					break;
			}
			return _this;
		}

		_this.data('clivia-params', _defaults);

		$(_calendarPanel).delegate('.clivia-calendar-date-ceil', 'fillDate', function() {
			_this.val($(this).data('clivia-date-value'));
		});

		_calendarPanel.css({
			display: 'none',
			position: 'absolute',
			backgroundColor: '#fff',
			borderRadius: 4,
			boxShadow: '0 0 3px 3px rgba(20%,20%,40%,0.4)',
			zIndex: 100000,
			padding: '15px 10px',
		});

		_monthTitle.find('.clivia-calendar-month').css({
			textAlign: 'center',
			fontWeight: 'bold',
			display: 'inline-block',
			width: '88%',
		});

		_monthTitle.find('.clivia-calendar-last-month').css({
			color: '#595959',
			textDecoration: 'none',
			textAlign: 'center',
			fontWeight: 'bold',
			fontSize: 20,
			display: 'inline-block',
			width: '6%',
		});

		_monthTitle.find('.clivia-calendar-next-month').css({
			color: '#595959',
			textDecoration: 'none',
			textAlign: 'center',
			fontWeight: 'bold',
			fontSize: 20,
			display: 'inline-block',
			width: '6%',
		});
		_monthTitle.appendTo(_calendarPanel);

		for (var i=0; i<_week.length; i++) {
			var day = $('<div class="clivia-calendar-date-week"></div>').css({display:'inline-block',width:35,height:26,fontSize:14,textAlign:'center',padding:2}) ;
			day.html(_week[i]);
			day.appendTo(_weekContainer);
		}
		_weekContainer.css({width:'100%',marginBottom:5,fontWeight:'bold',color:'#4545FF'}).appendTo(_calendarContainer);
		_calendarContainer.appendTo(_calendarPanel);

		$('<div class="time-text-container hour-container"><span class="btn-increase-hour">+</span><h4 class="hours">00</h4><span class="btn-decrease-hour">-</span></div>').appendTo(_timeContainer);
		$('<div class="time-text-container colon-container"><span>&nbsp;</span><h4 class="time-colon">:</h4><span>&nbsp;</span></div>').css({fontSize: '1.2rem'}).appendTo(_timeContainer);
		$('<div class="time-text-container minutes-container"><span class="btn-increase-minutes">+</span><h4 class="minutes">00</h4><span class="btn-decrease-minutes">-</span></div>').appendTo(_timeContainer);
		$('<input name="clivia_time_value" type="hidden" value="00:00" />').appendTo(_timeContainer);

		_timeContainer.css({
			display: 'block',
			padding: 10,
			textAlign: 'center',
			color: '#7c8081'
		});

		_timeContainer.find('.time-text-container').css({
			display: 'inline-block',
			width: '2.5rem'
		});

		_timeContainer.find('.time-text-container').find('.btn-increase-hour, .btn-decrease-hour, .btn-increase-minutes, .btn-decrease-minutes').css({
			cursor: 'pointer',
			color: '#878787',
			margin: '10px 0'
		});

		_timeContainer.find('.time-text-container').find('h4').css({
			margin: '0 auto'
		});

		_timeContainer.appendTo(_calendarPanel);
		
		_setTimer();
		_setCalendarPanel(_year, _month, _date, _hours, _minutes, _defaults.format);
		_calendarPanel.insertAfter(_this);

		_this.on('click', function(e) {
			e.preventDefault();
			if (_calendarPanel.css('display') === 'none') {
				_calendarPanel.fadeIn(_duration);
				_calendarPanel.css({top: _this.position().top + _this.outerHeight(false) + 10});
				_calendarPanel.css({left: _this.position().left});
			} else {
				_calendarPanel.fadeOut(_duration);
			}
		});

		return _this;
	}
});