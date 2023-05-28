const {
  HOUR_BLOCK_HEIGHT,
  getScheduleBlockHeight,
  getTimeDifference,
  getMinutes,
  getHours,
  getScheduleBlockPadding,
  convertMilitaryTimeToDecimal,
  convertStandardTimeToMilitaryTime,
  convertMinutesToDecimal
} = require('../../public/assets/js/scheduleBuilder');

describe('getScheduleBlockHeight', () => {
  test('returns correct schedule block height', () => {
    const course = {
      startTime: '10:30 AM',
      endTime: '12:00 PM',
    };
    const expectedHeight = (1.5) * HOUR_BLOCK_HEIGHT;
    const height = getScheduleBlockHeight(course);
    expect(height).toBe(expectedHeight);
  });
});

describe('getTimeDifference', () => {
  test('returns correct time difference for 10:30 AM and 11:30 AM', () => {
    const startTime = '10:00 AM';
    const endTime = '11:30 AM';
    const expectedDifference = 1.5;
    const difference = getTimeDifference(startTime, endTime);
    expect(difference).toBe(expectedDifference);
  });

  test('returns 0 when startTime and endTime are the same', () => {
    const startTime = '2:00 PM';
    const endTime = '2:00 PM';
    const expectedDifference = 0;
    const difference = getTimeDifference(startTime, endTime);
    expect(difference).toBe(expectedDifference);
  });
});

describe('getHours', () => {
  test('returns 14 hours from military time 1430', () => {
    const militaryTime = 1430;
    const expectedHours = 14;
    const hours = getHours(militaryTime);
    expect(hours).toBe(expectedHours);
  });
});

describe('getMinutes', () => {
  test('returns 30 minutes from military time 1430', () => {
    const militaryTime = 1430;
    const expectedMinutes = 30;
    const minutes = getMinutes(militaryTime);
    expect(minutes).toBe(expectedMinutes);
  });
});


describe('getScheduleBlockPadding', () => {
  test('returns correct padding for 8 am', () => {
    const course = {
      startTime: '8:00 AM',
    };
    const expectedPadding = HOUR_BLOCK_HEIGHT;
    const padding = getScheduleBlockPadding(course);
    expect(padding).toBe(expectedPadding);
  });

  test('returns correct padding for 12 pm', () => {
    const course = {
      startTime: '12:00 PM',
    };
    const expectedPadding = 5 * HOUR_BLOCK_HEIGHT;
    const padding = getScheduleBlockPadding(course);
    expect(padding).toBe(expectedPadding);
  });
});


describe('convertMilitaryTimeToDecimal', () => {
  test('converts military time 1430 to decimal 14.5', () => {
    const input = '1430';
    const expectedOutput = 14.5;
    expect(convertMilitaryTimeToDecimal(input)).toBe(expectedOutput);
  });

  test('converts military time 0800 to decimal 8', () => {
    const input = '0800';
    const expectedOutput = 8;
    expect(convertMilitaryTimeToDecimal(input)).toBe(expectedOutput);
  });
});

describe('convertStandardTimeToMilitaryTime', () => {
  test('converts standard time 12:30 PM to military time 1230', () => {
    const input = '12:30 PM';
    const expectedOutput = 1230;
    expect(convertStandardTimeToMilitaryTime(input)).toBe(expectedOutput);
  });

  test('converts standard time 11:45 AM to military time 1145', () => {
    const input = '11:45 AM';
    const expectedOutput = 1145;
    expect(convertStandardTimeToMilitaryTime(input)).toBe(expectedOutput);
  });
});

describe('convertMinutesToDecimal', () => {
  test('converts 30 minutes to decimal 0.5', () => {
    const input = 30;
    const expectedOutput = 0.5;
    expect(convertMinutesToDecimal(input)).toBe(expectedOutput);
  });

  test('converts 15 minutes to decimal 0.25', () => {
    const input = 15;
    const expectedOutput = 0.25;
    expect(convertMinutesToDecimal(input)).toBe(expectedOutput);
  });
});
