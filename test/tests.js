(function () {
  // Epoch in seconds, for test convenience. Comparing milliseconds sucks, because
  // time instances created runtime might differ with a few MS.
  Time.prototype.s = function(){
    return Math.floor(this.epoch() / 1000);
  }
  
  TestCase("Base test", {
    "test basic accessors": function () {
      var now = new Time();
      var date = new Date();

      now.year(2008);
      assertEquals(now.year(), 2008);

      assertEquals(now.day(), date.getDate());
      now.day(5);
      assertEquals(now.day(), 5);
    },
    
    "test basic accessors": function () {
      var now = new Time();
      var date = new Date();

      now.year(2008);
      assertEquals(now.year(), 2008);

      assertEquals(now.day(), date.getDate());
      now.day(5);
      assertEquals(now.day(), 5);
    },
    
    "test weekday": function () {
      assertEquals(1, new Time(2008, 5, 11).weekday());
    	assertEquals(7, new Time(2008, 5, 17).weekday());

    	var time = new Time(2008, 5, 16);
    	time.weekday(1);
    	assertEquals(1, time.weekday());
    	assertEquals(new Time(2008, 5, 11).s(), time.s());

    	var time = new Time(2008, 5, 12);
    	time.weekday(7);
    	assertEquals(7, time.weekday());
    	assertEquals(new Time(2008, 5, 17).s(), time.s());

    	Time.firstDayOfWeek = 2

    	assertEquals(6, new Time(2008, 5, 17).weekday())
    	assertEquals(7, new Time(2008, 5, 18).weekday())

    	var time = new Time(2008, 5, 17);
    	time.weekday(1);
    	assertEquals(1, time.weekday());
    	assertEquals(new Time(2008, 5, 12).s(), time.s());

    	var time = new Time(2008, 5, 13);
    	time.weekday(7);
    	assertEquals(7, time.weekday());
    	assertEquals(new Time(2008, 5, 18).s(), time.s());

    	Time.firstDayOfWeek = 5;
    	assertEquals(1, new Time(2008, 5, 15).weekday());
    	assertEquals(7, new Time(2008, 5, 21).weekday());

    	Time.firstDayOfWeek = 1
    },
    
    "test creating instance defaults to now": function () {
      var now = new Time();
      var date = new Date();

      assertEquals(now.year(), date.getFullYear());
      assertEquals(now.second(), date.getSeconds());
    },
    
    "test creating instance with string piggybacks to Date.parse": function () {
      var now = new Time("Jul 8, 2005");

      assertEquals(now.year(), 2005);
      assertEquals(now.month(), 7); // Should not be zero indexed
      assertEquals(now.day(), 8);
    },
    
    "test cloning": function () {
      var time = new Time(2008, 5);
      var clone = time.clone();

      assertEquals(clone.year(), 2008);
      assertEquals(clone.month(), 5);

      clone.year(1994);
      assertEquals(time.year(), 2008) // Shouldn't change
    },
    
    "test isLeapYear": function () {
      assertTrue(new Time(2008).isLeapYear());
      assertTrue(new Time(1804).isLeapYear());
      assertTrue(new Time(2292).isLeapYear());

      assertFalse(new Time(2009).isLeapYear());
    },
    
    "test days in month": function () {
      assertEquals(new Time(2008, 1).daysInMonth(), 31);
      assertTrue(new Time(2008, 2).daysInMonth() < 30); // leap years, hooray
      assertEquals(new Time(2008, 3).daysInMonth(), 31);
      assertEquals(new Time(2008, 4).daysInMonth(), 30);
      assertEquals(new Time(2008, 5).daysInMonth(), 31);
      assertEquals(new Time(2008, 6).daysInMonth(), 30);
      assertEquals(new Time(2008, 7).daysInMonth(), 31);
      assertEquals(new Time(2008, 8).daysInMonth(), 31);
      assertEquals(new Time(2008, 9).daysInMonth(), 30);
      assertEquals(new Time(2008, 10).daysInMonth(), 31);
      assertEquals(new Time(2008, 11).daysInMonth(), 30);
      assertEquals(new Time(2008, 12).daysInMonth(), 31);
    },
    
    "test weeks in month": function () {
      assertEquals(new Time(2008, 1).weeksInMonth(), 5);
    	assertEquals(new Time(2008, 2).weeksInMonth(), 5);
    	assertEquals(new Time(2008, 3).weeksInMonth(), 6);
    	assertEquals(new Time(2008, 4).weeksInMonth(), 5);
    	assertEquals(new Time(2008, 5).weeksInMonth(), 5);
    	assertEquals(new Time(2008, 6).weeksInMonth(), 5);
    	assertEquals(new Time(2008, 7).weeksInMonth(), 5);
    	assertEquals(new Time(2008, 8).weeksInMonth(), 6);
    	assertEquals(new Time(2008, 9).weeksInMonth(), 5);
    	assertEquals(new Time(2008, 10).weeksInMonth(), 5);
    	assertEquals(new Time(2008, 11).weeksInMonth(), 6);
    	assertEquals(new Time(2008, 12).weeksInMonth(), 5);
    },
    
    "test setting first day of week on instance": function () {
      assertEquals(1, new Time(2008, 4, 27).weekday())

      var t = new Time(2008, 4, 28);
      t.firstDayOfWeek = 2;
      assertEquals(1, t.weekday());

      // Instance scope overrides global scope.
      Time.firstDayOfWeek = 4
      assertEquals(1, t.weekday());
      Time.firstDayOfWeek = 1
    }
  })
  
  TestCase("Stepping", {
    "test beginning": function () {
      assertEquals(new Time(2008, 1, 0, 0, 0).s(),    new Time(2008, 5, 17, 15, 30).beginningOfYear().s());
      assertEquals(new Time(2008, 5, 0, 0, 0).s(),    new Time(2008, 5, 17, 15, 30).beginningOfMonth().s());
      assertEquals(new Time(2008, 5, 17, 0, 0).s(),   new Time(2008, 5, 17, 15, 30).beginningOfDay().s());
      assertEquals(new Time(2008, 5, 17, 15, 0).s(),  new Time(2008, 5, 17, 15, 30).beginningOfHour().s());
      assertEquals(new Time(2008, 5, 17, 15, 30).s(), new Time(2008, 5, 17, 15, 30).beginningOfMinute().s());

    	assertEquals(new Time(2008, 5, 17).beginningOfWeek().s(), new Time(2008, 5, 11).s())

    	Time.firstDayOfWeek = 2;

    	assertEquals(new Time(2008, 5, 17).beginningOfWeek().s(), new Time(2008, 5, 12).s())

    	Time.firstDayOfWeek = 1;
    },
    
    "test end": function () {
      assertEquals(new Time(2008, 12, 31, 23, 59, 59, 999).s(), new Time(2008, 5, 17, 15, 30).endOfYear().s());

      // January should have 31 days
      assertEquals(new Time(2008, 1, 31, 23, 59, 59, 999).s(), new Time(2008, 1, 23).endOfMonth().s());
      // April should have 30 days
      assertEquals(new Time(2008, 4, 30, 23, 59, 59, 999).s(), new Time(2008, 4, 15).endOfMonth().s());

      assertEquals(new Time(2008, 5, 17, 23, 59, 59, 999).s(), new Time(2008, 5, 17, 15, 30).endOfDay().s());
      assertEquals(new Time(2008, 5, 17, 15, 59, 59, 999).s(), new Time(2008, 5, 17, 15, 30).endOfHour().s());
      assertEquals(new Time(2008, 5, 17, 15, 30, 59, 999).s(), new Time(2008, 5, 17, 15, 30, 23).endOfMinute().s());

    	assertEquals(new Time(2008, 5, 12).endOfWeek().s(), new Time(2008, 5, 17).endOfDay().s())

    	Time.firstDayOfWeek = 2;

    	assertEquals(new Time(2008, 5, 17).endOfWeek().s(), new Time(2008, 5, 18).endOfDay().s())

    	Time.firstDayOfWeek = 1;
    },
    
    "test first day in calendar month": function () {
      assertEquals(new Time(2008, 1).firstDayInCalendarMonth().s(), new Time(2007, 12, 30).s());
    	assertEquals(new Time(2008, 2).firstDayInCalendarMonth().s(), new Time(2008, 1, 27).s());
    	assertEquals(new Time(2008, 3).firstDayInCalendarMonth().s(), new Time(2008, 2, 24).s());

    	assertEquals(new Time(2008, 4).firstDayInCalendarMonth().s(), new Time(2008, 3, 30).s());

    	Time.firstDayOfWeek = 2;
    	assertEquals(new Time(2008, 4, 1).firstDayInCalendarMonth().s(), new Time(2008, 3, 31).s())
    	assertEquals(new Time(2008, 3, 1).firstDayInCalendarMonth().s(), new Time(2008, 2, 25).s());
    	Time.firstDayOfWeek = 1;
    },
    
    "test advance days": function () {
      assertEquals(new Time(2008, 5, 17).advanceDays(1).s(), new Time(2008, 5, 18).s());
    	assertEquals(new Time(2008, 5, 17).advanceDays(-1).s(), new Time(2008, 5, 16).s());
    	assertEquals(new Time(2008, 5, 17).advanceDays(-10).s(), new Time(2008, 5, 7).s());

    	assertEquals(new Time(2008, 5, 17).advanceDays(20).s(), new Time(2008, 6, 6).s());
    	assertEquals(new Time(2008, 5, 17).advanceDays(-20).s(), new Time(2008, 4, 27).s());

    	// This will break with a simple epoch() implementation.
    	assertEquals(new Time(2008, 4).advanceDays(-2).s(), new Time(2008, 3, 30).s());
    },
    
    "test advance month": function () {
      assertEquals(new Time(2008, 5).advanceMonths(1).s(), new Time(2008, 6).s());
    	assertEquals(new Time(2008, 1).advanceMonths(-1).s(), new Time(2007, 12).s());
    	assertEquals(new Time(2008, 1, 31).advanceMonths(1).s(), new Time(2008, 2, 29).s()); // 2008 is a leap year
    	assertEquals(new Time(2007, 12, 31).advanceMonths(2).s(), new Time(2008, 2, 29).s());
    	assertEquals(new Time(2007, 1, 31).advanceMonths(1).s(), new Time(2007, 2, 28).s())
    	assertEquals(new Time(2008, 1, 3).advanceMonths(-13).s(), new Time(2006, 12, 3).s())
    },
    
    "test next month": function () {
      assertEquals(new Time(2008, 6, 1).s(), new Time(2008, 5, 17).nextMonth().s());
      assertEquals(new Time(2009, 1, 1).s(), new Time(2008, 12, 24).nextMonth().s());
    },
    
    "test previous month": function () {
      assertEquals(new Time(2008, 4, 1).s(), new Time(2008, 5, 17).previousMonth().s());
      assertEquals(new Time(2007, 12, 1).s(), new Time(2008, 1, 5).previousMonth().s());
    }
  })
}());
