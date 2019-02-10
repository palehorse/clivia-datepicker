(function( factory ) {
	if (typeof(require) === 'function') {
		module.exports = factory(jQuery);
	} else {
		factory(jQuery);
	}
})(function( $ ) {
	var _duration = 150;
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

		if (month < 10 && typeof signs[0] !== 'undefined') {
			month = '0' + month;
		}
		str += signs[0] + month;

		if (date < 10 && typeof signs[1] !== 'undefined') {
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
		ceil.trigger('fillDate');
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

	function _setCalendarCeil(year, month, date, format, calendarContainer) {
		var total = ((new Date(_formatDate(year, month, 1, format))).getDay()) + (6 - (new Date(_formatDate(year, month, (new Date(year, month, 0)).getDate(), format))).getDay()) + (new Date(year, month, 0)).getDate(),
			currentDate = _formatDate(year, month, date, format);
		
		for (var i=1; i<=total; i++) {
			_calculateDate(year, month, i, format, function(count, date, status) {
				var ceil = $('<div class="clivia-calendar-date-ceil"></div>').css({display:'inline-block',width:38,height:30,textAlign:'center',padding:2,cursor:'pointer'});
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
					_focusDate(ceil);
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
				ceil.appendTo(calendarContainer);
			});
		}
	}

	function _setCalendarPanel(year, month, date, format, calendarPanel) {
		var calendarContainer = calendarPanel.find('.clivia-calendar-container');
		calendarPanel.find('.clivia-calendar-month-title .clivia-calendar-month').text(year + '年' + month + '月');
		
		_setCalendarCeil(year, month, date, format, calendarContainer);

		calendarContainer.css({
			display: 'inline-block',
			width: 266,
		});

		calendarPanel.find('a.clivia-calendar-last-month')
					 .off('click')
					 .on('click', function(e) {
					     e.preventDefault();
					  	 calendarPanel.find('.clivia-calendar-date-ceil').remove();
					  	 month = (month - 1 > 0) ? month - 1 : 12;
					  	 year = (month == 12) ? year - 1 : year;
					  	 _setCalendarPanel(year, month, date, format, calendarPanel);
					 });

		calendarPanel.find('a.clivia-calendar-next-month')
					 .off('click')
					 .on('click', function(e) {
					     e.preventDefault();
					  	 calendarPanel.find('.clivia-calendar-date-ceil').remove();
					  	 month = (month + 1 > 12) ? month - 11 : month + 1;
					  	 year = (month == 1) ? year + 1 : year;
					  	 _setCalendarPanel(year, month, date, format, calendarPanel);
					 });
		calendarPanel.find('.clivia-calendar-date-ceil')
					 .off('click')
					 .on('click', function(e) {
					     e.preventDefault();
					  	 _focusDate($(this));
					 });
	}

	function _setValue(target, value, format) {
		target.val(value);
		if (!_checkFormat(value, format)) resetValue(target);
		else {
			target.next('.clivia-calendar-panel').find('.clivia-calendar-date-ceil').each(function() {
				var ceilValue = $(this).data('clivia-date-value');
				if (ceilValue == value) {
					_focusDate($(this));
				}
			});
		}
	}

	function _resetValue(target, format) {
		target.next('.clivia-calendar-panel').find('.clivia-calendar-date-ceil').each(function() {
			var ceilValue = $(this).data('clivia-date-value');
			if (ceilValue == target.val()) {
				_focusDate($(this));
			}
		});
	}

	function _show(target) {
		target.next('.clivia-calendar-panel').fadeIn(_duration);
	}

	function _hide(target) {
		target.next('.clivia-calendar-panel').fadeOut(_duration);
	}

	$.fn.datepicker = function(params, value) {
		var _this = this, _defaults = {},
			_year = (new Date()).getFullYear(),
			_month = (new Date()).getMonth() + 1,
			_date = (new Date()).getDate(),
			_week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			_monthTitle = $('<div class="clivia-calendar-month-title"><a href="" class="clivia-calendar-last-month">&lang;</a><h5 class="clivia-calendar-month"></h5><a href="" class="clivia-calendar-next-month">&rang;</a></div>'),
			_calendarPanel = $('<div class="clivia-calendar-panel"></div>'),
			_calendarContainer = $('<div class="clivia-calendar-container"></div>'),
			_weekContainer = $('<div class="clivia-calendar-week-container"></div>');
		
		_defaults.format = "yyyy-mm-dd";

		if (typeof params === 'string') {
			if (typeof _this.data('clivia-params') === 'object') $.extend(_defaults, _this.data('clivia-params'));
			switch (params) {
				case 'set':
					_setValue.call(null, _this, value, _defaults.format);
					break;
				case 'reset':
					_resetValue.call(null, _this, _defaults.format);
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
		
		if (typeof params === 'object') {
			if (/yyyy(.*)mm(.*)dd/.test(params.format)) {
				$.extend(_defaults, params);
			}
		}

		_this.data('clivia-params', _defaults);

		$(document).delegate('.clivia-calendar-date-ceil', 'fillDate', function() {
			_this.val($(this).data('clivia-date-value'));
		});

		_calendarPanel.css({
			display: 'none',
			position: 'absolute',
			backgroundColor: '#fff',
			borderRadius: 4,
			boxShadow: '0 0 3px 3px rgba(20%,20%,40%,0.4)',
			zIndex: 100000,
			padding: 10,
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
			var day = $('<div class="clivia-calendar-date-week"></div>').css({display:'inline-block',width:38,height:30,fontSize:14,textAlign:'center',padding:2}) ;
			day.html(_week[i]);
			day.appendTo(_weekContainer);
		}
		_weekContainer.css({width:'100%',marginBottom:5,fontWeight:'bold',color:'#4545FF'}).appendTo(_calendarContainer);
		_calendarContainer.appendTo(_calendarPanel, _calendarPanel);
		_setCalendarPanel(_year, _month, _date, _defaults.format, _calendarPanel)
		_calendarPanel.insertAfter(_this);

		_this.on('click', function(e) {
			e.preventDefault();
			if (_calendarPanel.css('display') === 'none') {
				if(_this.val() == '') _this.val(_formatDate(_year, _month, _date));
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