// Generated by CoffeeScript 1.3.3
(function() {
  var Twix, assertDeepEqual, assertEqual, moment, thatDay, thisYear, tomorrow, yesterday;

  if (typeof module !== "undefined") {
    moment = require("moment");
    assertEqual = require('assert').equal;
    assertDeepEqual = require('assert').deepEqual;
    Twix = require("../../bin/twix");
  } else {
    moment = window.moment;
    Twix = window.Twix;
    assertEqual = function(a, b) {
      if (a !== b) {
        throw new Error("Found " + b + ", expected " + a);
      }
    };
    assertDeepEqual = function(a, b) {
      if (!a.equals(b)) {
        throw new Error("Found " + b + ", expected " + a);
      }
    };
  }

  thisYear = function(partial, time) {
    var fullDate;
    fullDate = "" + partial + "/" + (moment().year());
    if (time) {
      fullDate += " " + time;
    }
    return moment(fullDate);
  };

  yesterday = function() {
    return moment().subtract('days', 1).sod();
  };

  tomorrow = function() {
    return moment().add('days', 1).sod();
  };

  thatDay = function(start, end) {
    if (start) {
      return new Twix("5/25/1982 " + start, "5/25/1982 " + end);
    } else {
      return new Twix("5/25/1982", "5/25/1982", true);
    }
  };

  describe("sameYear()", function() {
    it("returns true if they're the same year", function() {
      return assertEqual(true, new Twix("5/25/1982", "10/14/1982").sameYear());
    });
    return it("returns false if they're different years", function() {
      return assertEqual(false, new Twix("5/25/1982", "10/14/1983").sameYear());
    });
  });

  describe("sameDay()", function() {
    it("returns true if they're the same day", function() {
      return assertEqual(true, new Twix("5/25/1982 5:30 AM", "5/25/1982 7:30 PM").sameDay());
    });
    it("returns false if they're different days day", function() {
      return assertEqual(false, new Twix("5/25/1982 5:30 AM", "5/26/1982 7:30 PM").sameDay());
    });
    return it("returns true they're in different UTC days but the same local days", function() {
      return assertEqual(true, new Twix("5/25/1982 5:30 AM", "5/25/1982 11:30 PM").sameDay());
    });
  });

  describe("countDays()", function() {
    it("inside one day returns 1", function() {
      var end, range, start;
      start = thisYear("5/25", "3:00");
      end = thisYear("5/25", "14:00");
      range = new Twix(start, end);
      return assertEqual(1, range.countDays());
    });
    it("returns 2 if the range crosses midnight", function() {
      var end, range, start;
      start = thisYear("5/25", "16:00");
      end = thisYear("5/26", "3:00");
      range = new Twix(start, end);
      return assertEqual(2, range.countDays());
    });
    return it("works fine for all-day events", function() {
      var end, range, start;
      start = thisYear("5/25");
      end = thisYear("5/26");
      range = new Twix(start, end, true);
      return assertEqual(2, range.countDays());
    });
  });

  describe("daysIn()", function() {
    var assertSameDay;
    assertSameDay = function(first, second) {
      assertEqual(first.year(), second.year());
      assertEqual(first.month(), second.month());
      return assertEqual(first.date(), second.date());
    };
    it("provides 1 day if the range includes 1 day", function() {
      var end, iter, next, range, start;
      start = thisYear("5/25", "3:00");
      end = thisYear("5/25", "14:00");
      range = new Twix(start, end);
      iter = range.daysIn();
      next = iter.next();
      console.log(next);
      assertSameDay(thisYear("5/25"), next);
      return assertEqual(null, iter.next());
    });
    it("provides 2 days if the range crosses midnight", function() {
      var end, iter, range, start;
      start = thisYear("5/25", "16:00");
      end = thisYear("5/26", "3:00");
      range = new Twix(start, end);
      iter = range.daysIn();
      assertSameDay(thisYear("5/25"), iter.next());
      assertSameDay(thisYear("5/26"), iter.next());
      return assertEqual(null, iter.next());
    });
    it("provides 366 days if the range is a year", function() {
      var end, iter, results, start;
      start = thisYear("5/25", "16:00");
      end = thisYear("5/25", "3:00").add('years', 1);
      iter = new Twix(start, end).daysIn();
      results = (function() {
        var _results;
        _results = [];
        while (iter.hasNext()) {
          _results.push(iter.next());
        }
        return _results;
      })();
      return assertEqual(366, results.length);
    });
    it("provides 1 day for an all-day event", function() {
      var end, iter, start;
      start = thisYear("5/25");
      end = thisYear("5/25");
      iter = new Twix(start, end, true).daysIn();
      assertSameDay(thisYear("5/25"), iter.next());
      return assertEqual(null, iter.next());
    });
    it("doesn't generate extra days when there's a min time", function() {
      var end, iter, range, start;
      start = thisYear("5/25", "16:00");
      end = thisYear("5/26", "3:00");
      range = new Twix(start, end);
      iter = range.daysIn(4);
      assertSameDay(thisYear("5/25"), iter.next());
      return assertEqual(null, iter.next());
    });
    return it("provides 1 day for all-day events when there's a min time", function() {
      var end, iter, start;
      start = thisYear("5/25");
      end = thisYear("5/25");
      iter = new Twix(start, end, true).daysIn(4);
      assertEqual(true, iter.hasNext());
      assertSameDay(thisYear("5/25"), iter.next());
      assertEqual(false, iter.hasNext());
      return assertEqual(null, iter.next());
    });
  });

  describe("duration()", function() {
    describe("all-day events", function() {
      it("formats single-day correctly", function() {
        return assertEqual("all day", new Twix("5/25/1982", "5/25/1982", true).duration());
      });
      return it("formats multiday correctly", function() {
        return assertEqual("3 days", new Twix("5/25/1982", "5/27/1982", true).duration());
      });
    });
    return describe("non-all-day events", function() {
      it("formats single-day correctly", function() {
        return assertEqual("4 hours", thatDay("12:00", "16:00").duration());
      });
      return it("formats multiday correctly", function() {
        return assertEqual("2 days", new Twix("5/25/1982", "5/27/1982").duration());
      });
    });
  });

  describe("past()", function() {
    describe("all-day events", function() {
      it("returns true for days in the past", function() {
        return assertEqual(true, new Twix(yesterday(), yesterday(), true).past());
      });
      it("returns false for today", function() {
        return assertEqual(false, new Twix(moment().sod(), moment().sod(), true).past());
      });
      return it("returns false for days in the future", function() {
        return assertEqual(false, new Twix(tomorrow(), tomorrow(), true).past());
      });
    });
    return describe("non-all-day events", function() {
      it("returns true for the past", function() {
        return assertEqual(true, new Twix(moment().subtract('hours', 3), moment().subtract('hours', 2)).past());
      });
      return it("returns false for the future", function() {
        return assertEqual(false, new Twix(moment().add('hours', 2), moment().add('hours', 3)).past());
      });
    });
  });

  describe("overlaps", function() {
    var assertNoOverlap, assertOverlap, assertOverlapness, someDays, someTime;
    assertOverlap = function(first, second) {
      return assertOverlapness(true)(first, second);
    };
    assertNoOverlap = function(first, second) {
      return assertOverlapness(false)(first, second);
    };
    assertOverlapness = function(shouldOverlap) {
      return function(first, second) {
        assertEqual(shouldOverlap, first.overlaps(second));
        return assertEqual(shouldOverlap, second.overlaps(first));
      };
    };
    someTime = thatDay("5:30", "8:30");
    someDays = new Twix("5/24/1982", "5/25/1982", true);
    describe("non-all-day events", function() {
      it("returns false for a later event", function() {
        return assertNoOverlap(someTime, thatDay("9:30", "11:30"));
      });
      it("returns false for an earlier event", function() {
        return assertNoOverlap(someTime, thatDay("3:30", "4:30"));
      });
      it("returns true for a partially later event", function() {
        return assertOverlap(someTime, thatDay("8:00", "11:30"));
      });
      it("returns true for a partially earlier event", function() {
        return assertOverlap(someTime, thatDay("4:30", "6:30"));
      });
      it("returns true for an engulfed event", function() {
        return assertOverlap(someTime, thatDay("6:30", "7:30"));
      });
      return it("returns true for an engulfing event", function() {
        return assertOverlap(someTime, thatDay("4:30", "9:30"));
      });
    });
    describe("one all-day event", function() {
      it("returns true for a partially later event", function() {
        return assertOverlap(thatDay(), new Twix("5/25/1982 20:00", "5/26/1982 5:00"));
      });
      it("returns true for a partially earlier event", function() {
        return assertOverlap(thatDay(), new Twix("5/24/1982", "20:00", "5/25/1982 7:00"));
      });
      it("returns true for an engulfed event", function() {
        return assertOverlap(thatDay(), someTime);
      });
      return it("returns true for an engulfing event", function() {
        return assertOverlap(thatDay(), new Twix("5/24/1982 20:00", "5/26/1982 5:00"));
      });
    });
    return describe("two all-day events", function() {
      it("returns false for a later event", function() {
        return assertNoOverlap(someDays, new Twix("5/26/1982", "5/27/1982", true));
      });
      it("returns false for an earlier event", function() {
        return assertNoOverlap(someDays, new Twix("5/22/1982", "5/23/1982", true));
      });
      it("returns true for a partially later event", function() {
        return assertOverlap(someDays, new Twix("5/24/1982", "5/26/1982", true));
      });
      it("returns true for a partially earlier event", function() {
        return assertOverlap(someDays, new Twix("5/22/1982", "5/24/1982", true));
      });
      it("returns true for an engulfed event", function() {
        return assertOverlap(someDays, new Twix("5/25/1982", "5/25/1982", true));
      });
      return it("returns true for an engulfing event", function() {
        return assertOverlap(someDays, new Twix("5/22/1982", "5/28/1982", true));
      });
    });
  });

  describe("engulfs", function() {
    var assertEngulfing, assertNotEngulfing, someDays, someTime;
    assertEngulfing = function(first, second) {
      return assertEqual(true, first.engulfs(second));
    };
    assertNotEngulfing = function(first, second) {
      return assertEqual(false, first.engulfs(second));
    };
    someTime = thatDay("5:30", "8:30");
    someDays = new Twix("5/24/1982", "5/25/1982", true);
    describe("non-all-day events", function() {
      it("returns false for a later event", function() {
        return assertNotEngulfing(someTime, thatDay("9:30", "11:30"));
      });
      it("returns false for an earlier event", function() {
        return assertNotEngulfing(someTime, thatDay("3:30", "4:30"));
      });
      it("returns true for a partially later event", function() {
        return assertNotEngulfing(someTime, thatDay("8:00", "11:30"));
      });
      it("returns true for a partially earlier event", function() {
        return assertNotEngulfing(someTime, thatDay("4:30", "6:30"));
      });
      it("returns true for an engulfed event", function() {
        return assertEngulfing(someTime, thatDay("6:30", "7:30"));
      });
      return it("returns true for an engulfing event", function() {
        return assertNotEngulfing(someTime, thatDay("4:30", "9:30"));
      });
    });
    describe("one all-day event", function() {
      it("returns true for a partially later event", function() {
        return assertNotEngulfing(thatDay(), new Twix("5/25/1982 20:00", "5/26/1982 5:00"));
      });
      it("returns true for a partially earlier event", function() {
        return assertNotEngulfing(thatDay(), new Twix("5/24/1982", "20:00", "5/25/1982 7:00"));
      });
      it("returns true for an engulfed event", function() {
        return assertEngulfing(thatDay(), someTime);
      });
      return it("returns true for an engulfing event", function() {
        return assertNotEngulfing(thatDay(), new Twix("5/24/1982 20:00", "5/26/1982 5:00"));
      });
    });
    return describe("two all-day events", function() {
      it("returns false for a later event", function() {
        return assertNotEngulfing(someDays, new Twix("5/26/1982", "5/27/1982", true));
      });
      it("returns false for an earlier event", function() {
        return assertNotEngulfing(someDays, new Twix("5/22/1982", "5/23/1982", true));
      });
      it("returns true for a partially later event", function() {
        return assertNotEngulfing(someDays, new Twix("5/24/1982", "5/26/1982", true));
      });
      it("returns true for a partially earlier event", function() {
        return assertNotEngulfing(someDays, new Twix("5/22/1982", "5/24/1982", true));
      });
      it("returns true for an engulfed event", function() {
        return assertEngulfing(someDays, new Twix("5/25/1982", "5/25/1982", true));
      });
      return it("returns true for an engulfing event", function() {
        return assertNotEngulfing(someDays, new Twix("5/22/1982", "5/28/1982", true));
      });
    });
  });

  describe("merge()", function() {
    var someDays, someTime;
    someTime = thatDay("5:30", "8:30");
    someDays = new Twix("5/24/1982", "5/25/1982", true);
    console.log(someDays.end);
    describe("non-all-day events", function() {
      it("spans a later time", function() {
        return assertDeepEqual(thatDay("5:30", "11:30"), someTime.merge(thatDay("9:30", "11:30")));
      });
      it("spans an earlier time", function() {
        return assertDeepEqual(thatDay("3:30", "8:30"), someTime.merge(thatDay("3:30", "4:30")));
      });
      it("spans a partially later event", function() {
        return assertDeepEqual(thatDay("5:30", "11:30"), someTime.merge(thatDay("8:00", "11:30")));
      });
      it("spans a partially earlier event", function() {
        return assertDeepEqual(thatDay("4:30", "8:30"), someTime.merge(thatDay("4:30", "6:30")));
      });
      it("isn't affected by engulfed events", function() {
        return assertDeepEqual(someTime, someTime.merge(thatDay("6:30", "7:30")));
      });
      return it("becomes an engulfing event", function() {
        return assertDeepEqual(thatDay("4:30", "9:30"), someTime.merge(thatDay("4:30", "9:30")));
      });
    });
    describe("one all-day event", function() {
      it("spans a later time", function() {
        return assertDeepEqual(new Twix("5/24/1982 00:00", "5/26/1982 7:00"), someDays.merge(new Twix("5/24/1982 20:00", "5/26/1982 7:00")));
      });
      it("spans an earlier time", function() {
        return assertDeepEqual(new Twix("5/23/1982 8:00", moment("5/25/1982").eod()), someDays.merge(new Twix("5/23/1982 8:00", "5/25/1982 7:00")));
      });
      it("isn't affected by engulfing events", function() {
        return assertDeepEqual(new Twix("5/24/1982 00:00", moment("5/25/1982").eod()), someDays.merge(someTime));
      });
      return it("becomes an engulfing event", function() {
        return assertDeepEqual(new Twix("5/23/1982 20:00", "5/26/1982 8:30"), someDays.merge(new Twix("5/23/1982 20:00", "5/26/1982 8:30")));
      });
    });
    return describe("two all-day events", function() {
      it("spans a later time", function() {
        return assertDeepEqual(new Twix("5/24/1982", "5/28/1982", true), someDays.merge(new Twix("5/27/1982", "5/28/1982", true)));
      });
      it("spans an earlier time", function() {
        return assertDeepEqual(new Twix("5/21/1982", "5/25/1982", true), someDays.merge(new Twix("5/21/1982", "5/22/1982", true)));
      });
      it("spans a partially later time", function() {
        return assertDeepEqual(new Twix("5/24/1982", "5/26/1982", true), someDays.merge(new Twix("5/25/1982", "5/26/1982", true)));
      });
      it("spans a partially earlier time", function() {
        return assertDeepEqual(new Twix("5/23/1982", "5/25/1982", true), someDays.merge(new Twix("5/23/1982", "5/25/1982", true)));
      });
      it("isn't affected by engulfing events", function() {
        return assertDeepEqual(someDays, someDays.merge(thatDay()));
      });
      return it("becomes an engulfing event", function() {
        return assertDeepEqual(someDays, thatDay().merge(someDays));
      });
    });
  });

  describe("format()", function() {
    var test;
    test = function(name, t) {
      return it(name, function() {
        var twix;
        twix = new Twix(t.start, t.end, t.allDay);
        return assertEqual(t.result, twix.format(t.options));
      });
    };
    describe("simple ranges", function() {
      test("different year, different day shows everything", {
        start: "5/25/1982 5:30 AM",
        end: "5/26/1983 3:30 PM",
        result: 'May 25, 1982, 5:30 AM - May 26, 1983, 3:30 PM'
      });
      test("this year, different day skips year", {
        start: thisYear("5/25", "5:30 AM"),
        end: thisYear("5/26", "3:30 PM"),
        result: 'May 25, 5:30 AM - May 26, 3:30 PM'
      });
      test("same day, different times shows date once", {
        start: "5/25/1982 5:30 AM",
        end: "5/25/1982 3:30 PM",
        result: 'May 25, 1982, 5:30 AM - 3:30 PM'
      });
      return test("same day, different times, same meridian shows date and meridiem once", {
        start: "5/25/1982 5:30 AM",
        end: "5/25/1982 6:30 AM",
        result: 'May 25, 1982, 5:30 - 6:30 AM'
      });
    });
    describe("rounded times", function() {
      test("round hour doesn't show :00", {
        start: "5/25/1982 5:00 AM",
        end: "5/25/1982 7:00 AM",
        result: "May 25, 1982, 5 - 7 AM"
      });
      return test("mixed times still shows :30", {
        start: "5/25/1982 5:00 AM",
        end: "5/25/1982 5:30 AM",
        result: "May 25, 1982, 5 - 5:30 AM"
      });
    });
    describe("implicit minutes", function() {
      return test("still shows the :00", {
        start: thisYear("5/25", "5:00 AM"),
        end: thisYear("5/25", "7:00 AM"),
        options: {
          implicitMinutes: false
        },
        result: "May 25, 5:00 - 7:00 AM"
      });
    });
    describe("all day events", function() {
      test("one day has no range", {
        start: "5/25/2010",
        end: "5/25/2010",
        allDay: true,
        result: "May 25, 2010"
      });
      test("same month says month on one side", {
        start: thisYear("5/25"),
        end: thisYear("5/26"),
        allDay: true,
        result: "May 25 - 26"
      });
      test("different month shows both", {
        start: thisYear("5/25"),
        end: thisYear("6/1"),
        allDay: true,
        result: "May 25 - Jun 1"
      });
      test("explicit year shows the year once", {
        start: "5/25/1982",
        end: "5/26/1982",
        allDay: true,
        result: "May 25 - 26, 1982"
      });
      test("different year shows the year twice", {
        start: "5/25/1982",
        end: "5/25/1983",
        allDay: true,
        result: "May 25, 1982 - May 25, 1983"
      });
      test("different year different month shows the month at the end", {
        start: "5/25/1982",
        end: "6/1/1983",
        allDay: true,
        result: "May 25, 1982 - Jun 1, 1983"
      });
      return test("explicit allDay", {
        start: "5/25/1982",
        end: "5/25/1982",
        allDay: true,
        options: {
          explicitAllDay: true
        },
        result: "all day May 25, 1982"
      });
    });
    describe("no single dates", function() {
      test("shouldn't show dates for intraday", {
        start: "5/25/2010 5:30 AM",
        end: "5/25/2010 6:30 AM",
        options: {
          showDate: false
        },
        result: "5:30 - 6:30 AM"
      });
      test("should show the dates for multiday", {
        start: thisYear("5/25", "5:30 AM"),
        end: thisYear("5/27", "6:30 AM"),
        options: {
          showDate: false
        },
        result: "May 25, 5:30 AM - May 27, 6:30 AM"
      });
      return test("should just say 'all day' for all day events", {
        start: thisYear("5/25"),
        end: thisYear("5/25"),
        options: {
          showDate: false
        },
        allDay: true,
        result: "all day"
      });
    });
    describe("ungroup meridiems", function() {
      test("should put meridiems on both sides", {
        start: thisYear("5/25", "5:30 AM"),
        end: thisYear("5/25", "7:30 AM"),
        options: {
          groupMeridiems: false
        },
        result: "May 25, 5:30 AM - 7:30 AM"
      });
      return test("even with abbreviated hours", {
        start: thisYear("5/25", "7:00 PM"),
        end: thisYear("5/25", "9:00 PM"),
        options: {
          groupMeridiems: false
        },
        result: "May 25, 7 PM - 9 PM"
      });
    });
    describe("no meridiem spaces", function() {
      return test("should skip the meridiem space", {
        start: thisYear("5/25", "5:30 AM"),
        end: thisYear("5/25", "7:30 AM"),
        options: {
          spaceBeforeMeridiem: false,
          groupMeridiems: false
        },
        result: "May 25, 5:30AM - 7:30AM"
      });
    });
    describe("24 hours", function() {
      test("shouldn't show meridians", {
        start: thisYear("5/25", "5:30 AM"),
        end: thisYear("5/25", "7:30 PM"),
        options: {
          twentyFourHour: true
        },
        result: "May 25, 5:30 - 19:30"
      });
      return test("always shows the :00", {
        start: thisYear("5/25", "12:00"),
        end: thisYear("5/25", "15:00"),
        options: {
          twentyFourHour: true
        },
        result: "May 25, 12:00 - 15:00"
      });
    });
    describe("show day of week", function() {
      test("should show day of week", {
        start: thisYear("5/25", "5:30 AM"),
        end: thisYear("5/28", "7:30 PM"),
        options: {
          showDayOfWeek: true
        },
        result: "Fri May 25, 5:30 AM - Mon May 28, 7:30 PM"
      });
      test("collapses show day of week", {
        start: thisYear("5/25", "5:30 AM"),
        end: thisYear("5/25", "7:30 PM"),
        options: {
          showDayOfWeek: true
        },
        result: "Fri May 25, 5:30 AM - 7:30 PM"
      });
      return test("doesn't collapse with one week of separation", {
        start: thisYear("5/25"),
        end: thisYear("6/1"),
        allDay: true,
        options: {
          showDayOfWeek: true
        },
        result: "Fri May 25 - Fri Jun 1"
      });
    });
    return describe("goes into the morning", function() {
      test("elides late nights", {
        start: "5/25/1982 5:00 PM",
        end: "5/26/1982 2:00 AM",
        options: {
          lastNightEndsAt: 5
        },
        result: "May 25, 1982, 5 PM - 2 AM"
      });
      test("keeps late mornings", {
        start: "5/25/1982 5:00 PM",
        end: "5/26/1982 10:00 AM",
        options: {
          lastNightEndsAt: 5
        },
        result: "May 25, 5 PM - May 26, 10 AM, 1982"
      });
      test("morning start is adjustable", {
        start: "5/25/1982 5:00 PM",
        end: "5/26/1982 10:00 AM",
        options: {
          lastNightEndsAt: 11
        },
        result: "May 25, 1982, 5 PM - 10 AM"
      });
      test("doesn't elide if you start in the AM", {
        start: "5/25/1982 5:00 AM",
        end: "5/26/1982 4:00 AM",
        options: {
          lastNightEndsAt: 5
        },
        result: "May 25, 5 AM - May 26, 4 AM, 1982"
      });
      return describe("and we're trying to hide the date", function() {
        test("elides the date too for early mornings", {
          start: "5/25/1982 5:00 PM",
          end: "5/26/1982 2:00 AM",
          options: {
            lastNightEndsAt: 5,
            showDate: false
          },
          result: "5 PM - 2 AM"
        });
        return test("doesn't elide if the morning ends late", {
          start: "5/25/1982 5:00 PM",
          end: "5/26/1982 10:00 AM",
          options: {
            lastNightEndsAt: 5
          },
          result: "May 25, 5 PM - May 26, 10 AM, 1982"
        });
      });
    });
  });

}).call(this);
