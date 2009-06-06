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
  expect(5);
  equals(new Time(2008, 1, 0, 0, 0).s(),    new Time(2008, 5, 17, 15, 30).beginningOfYear().s());
  equals(new Time(2008, 5, 0, 0, 0).s(),    new Time(2008, 5, 17, 15, 30).beginningOfMonth().s());
  equals(new Time(2008, 5, 17, 0, 0).s(),   new Time(2008, 5, 17, 15, 30).beginningOfDay().s());
  equals(new Time(2008, 5, 17, 15, 0).s(),  new Time(2008, 5, 17, 15, 30).beginningOfHour().s());
  equals(new Time(2008, 5, 17, 15, 30).s(), new Time(2008, 5, 17, 15, 30).beginningOfMinute().s());
});

test("end", function(){
  expect(6);
  equals(new Time(2008, 12, 31, 23, 59, 59, 999).s(), new Time(2008, 5, 17, 15, 30).endOfYear().s());
  
  equals(new Time(2008, 1, 31, 23, 59, 59, 999).s(), new Time(2008, 1, 23).endOfMonth().s(), "january should have 31 days");
  equals(new Time(2008, 4, 30, 23, 59, 59, 999).s(), new Time(2008, 4, 15).endOfMonth().s(), "april should have 30 days");
  
  equals(new Time(2008, 5, 17, 23, 59, 59, 999).s(), new Time(2008, 5, 17, 15, 30).endOfDay().s());
  equals(new Time(2008, 5, 17, 15, 59, 59, 999).s(), new Time(2008, 5, 17, 15, 30).endOfHour().s());
  equals(new Time(2008, 5, 17, 15, 30, 59, 999).s(), new Time(2008, 5, 17, 15, 30, 23).endOfMinute().s());
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
})

test("next and previous month", function(){
  equals(new Time(2008, 6, 1).s(), new Time(2008, 5, 17).nextMonth().s());
  equals(new Time(2009, 1, 1).s(), new Time(2008, 12, 24).nextMonth().s());
  
  equals(new Time(2008, 4, 1).s(), new Time(2008, 5, 17).previousMonth().s());
  equals(new Time(2007, 12, 1).s(), new Time(2008, 1, 5).previousMonth().s());
});

test("advance", function(){
  equals(new Time(2008, 6, 17).s(), new Time(2008, 5, 17).advance({months: 1}).s())
  equals(new Time(2009, 1, 17).s(), new Time(2008, 5, 17).advance({months: 8}).s())
  equals(new Time(2008, 4, 17).s(), new Time(2008, 5, 17).advance({months: -1}).s())
})