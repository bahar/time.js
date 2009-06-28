(function(){
  var Time = function(yearOrString, month, day, hour, minute, second, millisecond){
    if (typeof(yearOrString) == "string") {
      this.date = new Date(Date.parse(yearOrString));
    } else {
      if (yearOrString) {
        this.date = new Date(yearOrString, (month - 1 || 0), (day || 1), (hour || 0), (minute || 0), (second || 0), (millisecond || 0));
      } else {
        this.date = new Date();
      }
    }
  }

  Time.firstDayOfWeek = 1;
  var DAYS_IN_MONTH = [
    // Starts at [1].
    null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ]
  var MILLISECONDS_IN_WEEK = 604800000.0;
  var THIRTY_TWO_DAYS = 2764800000;

  /////////////////////////////////////
  // The accessors. Uses the same function for both getting and
  // setting, e.g. year() to get and year(2005) to set.
  Time.accessor = function(name, dateFunctionName){
    Time.prototype[name] = function(value) {
      if (value != undefined) {
        this.date["set" + dateFunctionName](value);
      } else {
        return this.date["get" + dateFunctionName]();
      }
    }
  }
  
  Time.accessor("year", "FullYear");
  // month: see below
  Time.accessor("day", "Date")
  Time.accessor("hour", "Hours");
  Time.accessor("minute", "Minutes");
  Time.accessor("second", "Seconds");
  Time.accessor("millisecond", "Milliseconds");
  // weekday: See below
  Time.accessor("epoch", "Time");

  // Month gets special treatment, to avoid zero indexing from Date.
  Time.prototype.month = function(value) {
    if (value) {
      this.date.setMonth(value - 1);
    } else {
      return this.date.getMonth() + 1;
    }
  }

  // There is no setDay(), implementing that here.
  Time.prototype.weekday = function(value) {
    if (value) {
      this.advanceDays(value - this.weekday());
    } else {
      var a = (this.date.getDay() - (this.firstDayOfWeek || Time.firstDayOfWeek)) + 1;
      var b = 7;
      var ringModulo = a - Math.floor(a / b) * b;
      return ringModulo + 1
    }
  }

  /////////////////////////////////////
  // Utility
  Time.prototype.clone = function(){
    var newTime = new Time();
    newTime.epoch(this.epoch());
    newTime.firstDayOfWeek = this.firstDayOfWeek;

    return newTime;
  }

  Time.prototype.isLeapYear = function(){
    var year = this.year();
    return (year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0);
  }

  Time.prototype.daysInMonth = function(){
    if (this.month() == 2 && this.isLeapYear()) {
      return 29;
    }

    return DAYS_IN_MONTH[this.month()]
  }

  Time.prototype.weeksInMonth = function(){
    var millisecondsInThisMonth = this.clone().endOfMonth().epoch() - this.clone().firstDayInCalendarMonth().epoch()
    return Math.ceil(millisecondsInThisMonth / MILLISECONDS_IN_WEEK)
  }

  Time.prototype.firstDayInCalendarMonth = function(){
    this.beginningOfMonth();
    this.weekday(1);
    return this;
  }

  /////////////////////////////////////
  // Stepping
  Time.prototype.beginningOfYear = function(){
    this.month(1); this.beginningOfMonth();
    return this;
  }

  Time.prototype.beginningOfMonth = function(){
    this.day(1); this.beginningOfDay();
    return this;
  }

  Time.prototype.beginningOfWeek = function(){
    this.weekday(1); this.beginningOfDay();
    return this;
  }

  Time.prototype.beginningOfDay = function(){
    this.hour(0); this.beginningOfHour();
    return this;
  }

  Time.prototype.beginningOfHour = function(){
    this.minute(0); this.beginningOfMinute();
    return this;
  }

  Time.prototype.beginningOfMinute = function(){
    this.second(0); this.millisecond(0);
    return this;
  }

  // ------------

  Time.prototype.endOfYear = function(){
    this.month(12); this.endOfMonth();
    return this;
  }

  Time.prototype.endOfMonth = function(){
    this.day(this.daysInMonth()); this.endOfDay();
    return this;
  }

  Time.prototype.endOfWeek = function(){
    this.weekday(7); this.endOfDay();
    return this;
  }

  Time.prototype.endOfDay = function(){
    this.hour(23); this.endOfHour();
    return this;
  }

  Time.prototype.endOfHour = function(){
    this.minute(59); this.endOfMinute();
    return this;
  }

  Time.prototype.endOfMinute = function(){
    this.second(59);
    return this;
  }

  // ------------

  Time.prototype.nextMonth = function(){
    this.epoch(this.beginningOfMonth().epoch() + THIRTY_TWO_DAYS);
    this.beginningOfMonth();
    return this;
  }

  Time.prototype.previousMonth = function(){
    this.epoch(this.beginningOfMonth().epoch() - 1);
    this.beginningOfMonth();
    return this;
  }

  // ------------

  Time.prototype.advanceDays = function(days) {
    // I honestly don't know what I'm doing here. The beginningOfDay()
    // stuff really sucks.
    var milliseconds
    if (days < -1) {
      milliseconds = (86400000 * days) + 3600000
    } else {
      milliseconds = 86400000 * days;
    }
    this.epoch(this.epoch() + milliseconds);
    this.beginningOfDay()
    return this;
  }

  Time.prototype.advanceMonths = function(months) {
    var base = this.year() * 12 + (this.month() - 1) + months;
    var newYear = Math.floor(base / 12);
    var newMonth = (base % 12) + 1;

    // Setting the month to '2' on january 31th
    // gives us march 2nd. Circumventing this.
    var newTime = new Time(newYear, newMonth);
    var daysInNewTimeMonth = newTime.daysInMonth()

    if (this.day() > daysInNewTimeMonth) {
      this.year(newYear)
      this.day(1)
      this.month(newMonth)
      this.day(daysInNewTimeMonth)
    } else {
      this.year(newYear)
      this.month(newMonth)
    }

    return this;
  }


  // Todo: Some kind of noConflict() thing, in case people have a 'Time' around already.
  window.Time = Time;
})();