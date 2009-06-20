// Epoch in seconds, for test convenience. Comparing milliseconds sucks, because
// time instances created runtime might differ with a few MS.
Time.prototype.s = function(){
  return Math.floor(this.epoch() / 1000);
}
module("Core");

test("basic accessors", function(){
  expect(3);
  var now = new Time();
  var date = new Date();
  
  now.year(2008);
  equals(now.year(), 2008);
  
  equals(now.day(), date.getDate());
  now.day(5);
  equals(now.day(), 5);
});

test("weekday", function(){
	equals(1, new Time(2008, 5, 11).weekday());
	equals(7, new Time(2008, 5, 17).weekday());
	
	var time = new Time(2008, 5, 16);
	time.weekday(1);
	equals(1, time.weekday());
	equals(new Time(2008, 5, 11).s(), time.s());
	
	var time = new Time(2008, 5, 12);
	time.weekday(7);
	equals(7, time.weekday());
	equals(new Time(2008, 5, 17).s(), time.s());
	
	Time.firstDayOfWeek = 2
	
	equals(6, new Time(2008, 5, 17).weekday())
	equals(7, new Time(2008, 5, 18).weekday())
	
	var time = new Time(2008, 5, 17);
	time.weekday(1);
	equals(1, time.weekday());
	equals(new Time(2008, 5, 12).s(), time.s());
	
	var time = new Time(2008, 5, 13);
	time.weekday(7);
	equals(7, time.weekday());
	equals(new Time(2008, 5, 18).s(), time.s());
	
	Time.firstDayOfWeek = 5;
	equals(1, new Time(2008, 5, 15).weekday());
	equals(7, new Time(2008, 5, 21).weekday());
	
	Time.firstDayOfWeek = 1
});

test("creating instance defaults to now", function(){
  expect(2);
  var now = new Time();
  var date = new Date();
  
  equals(now.year(), date.getFullYear());
  equals(now.second(), date.getSeconds());
});

test("creating instance with string piggybacks to Date.parse", function(){
  expect(3);
  var now = new Time("Jul 8, 2005");
  
  equals(now.year(), 2005);
  equals(now.month(), 7, "should not be zero indexed");
  equals(now.day(), 8);
});

module("Utility");

test("cloning", function(){
  var time = new Time(2008, 5);
  var clone = time.clone();
  
  equals(clone.year(), 2008);
  equals(clone.month(), 5);
  
  clone.year(1994);
  equals(time.year(), 2008, "it shouldn't change")
});

test("isLeapYear", function(){
  ok(new Time(2008).isLeapYear());
  ok(new Time(1804).isLeapYear());
  ok(new Time(2292).isLeapYear());
  
  ok(!new Time(2009).isLeapYear());
})

module("Stepping");

test("beginning", function(){
  equals(new Time(2008, 1, 0, 0, 0).s(),    new Time(2008, 5, 17, 15, 30).beginningOfYear().s());
  equals(new Time(2008, 5, 0, 0, 0).s(),    new Time(2008, 5, 17, 15, 30).beginningOfMonth().s());
  equals(new Time(2008, 5, 17, 0, 0).s(),   new Time(2008, 5, 17, 15, 30).beginningOfDay().s());
  equals(new Time(2008, 5, 17, 15, 0).s(),  new Time(2008, 5, 17, 15, 30).beginningOfHour().s());
  equals(new Time(2008, 5, 17, 15, 30).s(), new Time(2008, 5, 17, 15, 30).beginningOfMinute().s());

	equals(new Time(2008, 5, 17).beginningOfWeek().s(), new Time(2008, 5, 11).s())
	
	Time.firstDayOfWeek = 2;
	
	equals(new Time(2008, 5, 17).beginningOfWeek().s(), new Time(2008, 5, 12).s())
	
	Time.firstDayOfWeek = 1;
});

test("end", function(){
  equals(new Time(2008, 12, 31, 23, 59, 59, 999).s(), new Time(2008, 5, 17, 15, 30).endOfYear().s());
  
  equals(new Time(2008, 1, 31, 23, 59, 59, 999).s(), new Time(2008, 1, 23).endOfMonth().s(), "january should have 31 days");
  equals(new Time(2008, 4, 30, 23, 59, 59, 999).s(), new Time(2008, 4, 15).endOfMonth().s(), "april should have 30 days");
  
  equals(new Time(2008, 5, 17, 23, 59, 59, 999).s(), new Time(2008, 5, 17, 15, 30).endOfDay().s());
  equals(new Time(2008, 5, 17, 15, 59, 59, 999).s(), new Time(2008, 5, 17, 15, 30).endOfHour().s());
  equals(new Time(2008, 5, 17, 15, 30, 59, 999).s(), new Time(2008, 5, 17, 15, 30, 23).endOfMinute().s());

	equals(new Time(2008, 5, 12).endOfWeek().s(), new Time(2008, 5, 17).endOfDay().s())
	
	Time.firstDayOfWeek = 2;
	
	equals(new Time(2008, 5, 17).endOfWeek().s(), new Time(2008, 5, 18).endOfDay().s())
	
	Time.firstDayOfWeek = 1;
});

test("days in month", function(){
  equals(new Time(2008, 1).daysInMonth(), 31);
  ok(new Time(2008, 2).daysInMonth() < 30); // leap years, hooray
  equals(new Time(2008, 3).daysInMonth(), 31);
  equals(new Time(2008, 4).daysInMonth(), 30);
  equals(new Time(2008, 5).daysInMonth(), 31);
  equals(new Time(2008, 6).daysInMonth(), 30);
  equals(new Time(2008, 7).daysInMonth(), 31);
  equals(new Time(2008, 8).daysInMonth(), 31);
  equals(new Time(2008, 9).daysInMonth(), 30);
  equals(new Time(2008, 10).daysInMonth(), 31);
  equals(new Time(2008, 11).daysInMonth(), 30);
  equals(new Time(2008, 12).daysInMonth(), 31);
});

test("first day in calendar month", function(){
	equals(new Time(2008, 1).firstDayInCalendarMonth().s(), new Time(2007, 12, 30).s());
	equals(new Time(2008, 2).firstDayInCalendarMonth().s(), new Time(2008, 1, 27).s());
	equals(new Time(2008, 3).firstDayInCalendarMonth().s(), new Time(2008, 2, 24).s());
	
	equals(new Time(2008, 4).firstDayInCalendarMonth().s(), new Time(2008, 3, 30).s());

	Time.firstDayOfWeek = 2;
	equals(new Time(2008, 4, 1).firstDayInCalendarMonth().s(), new Time(2008, 3, 31).s())
	equals(new Time(2008, 3, 1).firstDayInCalendarMonth().s(), new Time(2008, 2, 25).s());
	Time.firstDayOfWeek = 1;
})

test("advance days", function(){
	equals(new Time(2008, 5, 17).advanceDays(1).s(), new Time(2008, 5, 18).s());
	equals(new Time(2008, 5, 17).advanceDays(-1).s(), new Time(2008, 5, 16).s());
	equals(new Time(2008, 5, 17).advanceDays(-10).s(), new Time(2008, 5, 7).s());
	
	equals(new Time(2008, 5, 17).advanceDays(20).s(), new Time(2008, 6, 6).s());
	equals(new Time(2008, 5, 17).advanceDays(-20).s(), new Time(2008, 4, 27).s());

	// This will break with a simple epoch() implementation.
	equals(new Time(2008, 4).advanceDays(-2).s(), new Time(2008, 3, 30).s());
})

test("advance month", function(){
	equals(new Time(2008, 5).advanceMonths(1).s(), new Time(2008, 6).s());
	equals(new Time(2008, 1).advanceMonths(-1).s(), new Time(2007, 12).s());
	equals(new Time(2008, 1, 31).advanceMonths(1).s(), new Time(2008, 2, 29).s()); // 2008 is a leap year
	equals(new Time(2007, 12, 31).advanceMonths(2).s(), new Time(2008, 2, 29).s());
	equals(new Time(2007, 1, 31).advanceMonths(1).s(), new Time(2007, 2, 28).s())
	equals(new Time(2008, 1, 3).advanceMonths(-13).s(), new Time(2006, 12, 3).s())
})

test("next and previous month", function(){
  equals(new Time(2008, 6, 1).s(), new Time(2008, 5, 17).nextMonth().s());
  equals(new Time(2009, 1, 1).s(), new Time(2008, 12, 24).nextMonth().s());
  
  equals(new Time(2008, 4, 1).s(), new Time(2008, 5, 17).previousMonth().s());
  equals(new Time(2007, 12, 1).s(), new Time(2008, 1, 5).previousMonth().s());
});

test("weeks in month", function(){
	equals(new Time(2008, 1).weeksInMonth(), 5);
	equals(new Time(2008, 2).weeksInMonth(), 5);
	equals(new Time(2008, 3).weeksInMonth(), 6);
	equals(new Time(2008, 4).weeksInMonth(), 5);
	equals(new Time(2008, 5).weeksInMonth(), 5);
	equals(new Time(2008, 6).weeksInMonth(), 5);
	equals(new Time(2008, 7).weeksInMonth(), 5);
	equals(new Time(2008, 8).weeksInMonth(), 6);
	equals(new Time(2008, 9).weeksInMonth(), 5);
	equals(new Time(2008, 10).weeksInMonth(), 5);
	equals(new Time(2008, 11).weeksInMonth(), 6);
	equals(new Time(2008, 12).weeksInMonth(), 5);
});