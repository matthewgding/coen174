const {
    convertMilitaryTimeToDecimal,
    convertStandardTimeToMilitaryTime,
    convertMinutesToDecimal,
  } = require('../../public/assets/js/schedule');
  
  describe('convertMilitaryTimeToDecimal', () => {
    test('should convert military time 1430 to decimal 14.5', () => {
      const input = '1430';
      const expectedOutput = 14.5;
      expect(convertMilitaryTimeToDecimal(input)).toBe(expectedOutput);
    });
  
    test('should convert military time 0800 to decimal 8', () => {
      const input = '0800';
      const expectedOutput = 8;
      expect(convertMilitaryTimeToDecimal(input)).toBe(expectedOutput);
    });
  
    // Add more separate test cases as needed
  });
  
  describe('convertStandardTimeToMilitaryTime', () => {
    test('should convert standard time 12:30 PM to military time 1230', () => {
      const input = '12:30 PM';
      const expectedOutput = 1230;
      expect(convertStandardTimeToMilitaryTime(input)).toBe(expectedOutput);
    });
  
    test('should convert standard time 11:45 AM to military time 1145', () => {
      const input = '11:45 AM';
      const expectedOutput = 1145;
      expect(convertStandardTimeToMilitaryTime(input)).toBe(expectedOutput);
    });
  
    // Add more separate test cases as needed
  });
  
  describe('convertMinutesToDecimal', () => {
    test('should convert 30 minutes to decimal 0.5', () => {
      const input = 30;
      const expectedOutput = 0.5;
      expect(convertMinutesToDecimal(input)).toBe(expectedOutput);
    });
  
    test('should convert 15 minutes to decimal 0.25', () => {
      const input = 15;
      const expectedOutput = 0.25;
      expect(convertMinutesToDecimal(input)).toBe(expectedOutput);
    });
  
    // Add more separate test cases as needed
  });
  