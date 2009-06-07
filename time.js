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
  
  // Month gets special treatment, to avoid zero indexing from Date.
  Time.prototype.month = function(value) {
    if (value) {
      return this.date.setMonth(value - 1);
    } else {
      return this.date.getMonth() + 1;
    }
  }
  
  Time.accessor("year", "FullYear");
  // month: see above
  Time.accessor("day", "Date");
  Time.accessor("hour", "Hours");
  Time.accessor("minute", "Minutes");
  Time.accessor("second", "Seconds");
  Time.accessor("millisecond", "Milliseconds");
  //Time.accessor("weekday");
  Time.accessor("epoch", "Time");
  
  /////////////////////////////////////
  // Utility
  Time.prototype.clone = function(){
    var newTime = new Time();
    newTime.epoch(this.epoch());
    
    return newTime;
  }
  
  Time.prototype.isLeapYear = function(){
    var newTime = this.clone();
    newTime.month(2);
    return newTime.daysInMonth() == 29;
  }
  
  Time.prototype.daysInMonth = function(){
    var nextMonth = this.clone().nextMonth();
    nextMonth.epoch(nextMonth.epoch() - 3600);
    return nextMonth.date.getDate();
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
    // ...
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
    // ...
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
    this.epoch(this.beginningOfMonth().epoch() + 2764800000); // 32 days
    this.beginningOfMonth();
    return this;
  }
  
  Time.prototype.previousMonth = function(){
    this.epoch(this.beginningOfMonth().epoch() - 1);
    this.beginningOfMonth();
    return this;
  }
  
  // ------------
  
  Time.prototype.advance = function(opts) {
    
  }
  
  // Todo: Some kind of noConflict() thing, in case people have a 'Time' around already.
  window.Time = Time;
})();