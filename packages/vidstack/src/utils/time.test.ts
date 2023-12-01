import {
  formatHtml5Duration,
  formatSpokenTime,
  formatTime,
  padNumberWithZeroes,
  parseTime,
} from './time';

describe(padNumberWithZeroes.name, function () {
  it('should pad correctly', function () {
    expect(padNumberWithZeroes(1, 0)).to.equal('1');
    expect(padNumberWithZeroes(1, 1)).to.equal('1');
    expect(padNumberWithZeroes(1, 2)).to.equal('01');
    expect(padNumberWithZeroes(10, 2)).to.equal('10');
    expect(padNumberWithZeroes(20, 2)).to.equal('20');
    expect(padNumberWithZeroes(101, 2)).to.equal('101');
    expect(padNumberWithZeroes(101, 4)).to.equal('0101');
  });
});

describe(parseTime.name, function () {
  it('parses hours correctly', function () {
    expect(parseTime(3599).hours).to.equal(0);
    expect(parseTime(3600).hours).to.equal(1);
  });

  it('parses minutes correctly', function () {
    expect(parseTime(59).minutes).to.equal(0);
    expect(parseTime(60).minutes).to.equal(1);
    expect(parseTime(3599).minutes).to.equal(59);
    expect(parseTime(3600).minutes).to.equal(0);
    expect(parseTime(3659).minutes).to.equal(0);
    expect(parseTime(3660).minutes).to.equal(1);
  });

  it('parses seconds correctly', function () {
    expect(parseTime(0).seconds).to.equal(0);
    expect(parseTime(1).seconds).to.equal(1);
    expect(parseTime(59).seconds).to.equal(59);
    expect(parseTime(60).seconds).to.equal(0);
    expect(parseTime(61).seconds).to.equal(1);
  });

  it('parses decimals correctly', function () {
    expect(parseTime(0).fraction).to.equal(0);
    expect(parseTime(0.1).fraction).to.equal(0.1);
    expect(parseTime(1.05).fraction).to.equal(0.05);
    expect(parseTime(1.00256453).fraction).to.equal(0.00256);
  });
});

describe(formatTime.name, function () {
  it('adds a leading zero to seconds if seconds < 10', function () {
    expect(formatTime(0)).to.equal('0:00');
    expect(formatTime(1)).to.equal('0:01');
    expect(formatTime(60)).to.equal('1:00');
    expect(formatTime(61)).to.equal('1:01');
  });

  it('includes zero minutes if seconds < 60', function () {
    expect(formatTime(59)).to.equal('0:59');
  });

  it('formats minutes correctly if seconds >= 60', function () {
    expect(formatTime(60)).to.equal('1:00');
    expect(formatTime(83)).to.equal('1:23');
    expect(formatTime(754)).to.equal('12:34');
  });

  it('formats hours correctly if seconds >= 3600', function () {
    expect(formatTime(3600)).to.equal('1:00:00');
    expect(formatTime(5025)).to.equal('1:23:45');
    expect(formatTime(45296)).to.equal('12:34:56');
  });

  it('it should pad hours if `shouldPadHours` is true', function () {
    expect(formatTime(3600, true)).to.equal('01:00:00');
  });

  it('it should display hours if `shouldAlwaysShowHours` is true', function () {
    expect(formatTime(3500, false, false, true)).to.equal('0:58:20');
    expect(formatTime(3500, true, false, true)).to.equal('00:58:20');
  });
});

describe(formatSpokenTime.name, function () {
  it('it should format spoken time correctly', function () {
    expect(formatSpokenTime(0)).to.equal('0 sec');
    expect(formatSpokenTime(59)).to.equal('59 sec');
    expect(formatSpokenTime(60)).to.equal('1 min');
    expect(formatSpokenTime(83)).to.equal('1 min 23 sec');
    expect(formatSpokenTime(754)).to.equal('12 min 34 sec');
    expect(formatSpokenTime(3600)).to.equal('1 hour');
    expect(formatSpokenTime(5025)).to.equal('1 hour 23 min 45 sec');
    expect(formatSpokenTime(45296)).to.equal('12 hour 34 min 56 sec');
  });
});

describe(formatHtml5Duration.name, function () {
  it('formats PT datetime format correctly', function () {
    expect(formatHtml5Duration(0)).to.equal('PT0H0M0S');
    expect(formatHtml5Duration(1)).to.equal('PT0H0M1S');
    expect(formatHtml5Duration(60)).to.equal('PT0H1M0S');
    expect(formatHtml5Duration(3600)).to.equal('PT1H0M0S');
    expect(formatHtml5Duration(0.1)).to.equal('PT0H0M0.1S');
  });
});
