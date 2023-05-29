const {
    getAllCombinations,
    getIndexCombinations,
    getPossibleSchedules,
    sortByStartTime,
    hasConflictingTimes,
    hasTimeOverlap
} = require("../../public/assets/js/scheduleCombinations");

describe('getAllCombinations', () => {
    it('returns an empty array when the input array is empty', () => {
        const array2D = [];
        const result = getAllCombinations(array2D);
        expect(result).toEqual([]);
    });

    it('returns all combinations of elements from the input array', () => {
        const array2D = [
        ['A1', 'A2'],
        ['B1', 'B2'],
        ['C1', 'C2'],
        ];
        const result = getAllCombinations(array2D);
        expect(result).toEqual([
        ['A1', 'B1', 'C1'],
        ['A1', 'B1', 'C2'],
        ['A1', 'B2', 'C1'],
        ['A1', 'B2', 'C2'],
        ['A2', 'B1', 'C1'],
        ['A2', 'B1', 'C2'],
        ['A2', 'B2', 'C1'],
        ['A2', 'B2', 'C2'],
        ]);
    });

    it('returns the correct combinations for a 2x2 array', () => {
        const array2D = [
        ['A1', 'A2'],
        ['B1', 'B2'],
        ];
        const result = getAllCombinations(array2D);
        expect(result).toEqual([
        ['A1', 'B1'],
        ['A1', 'B2'],
        ['A2', 'B1'],
        ['A2', 'B2'],
        ]);
    });

    it('returns the correct combinations for a 3x1 array', () => {
        const array2D = [
        ['A1'],
        ['B1'],
        ['C1'],
        ];
        const result = getAllCombinations(array2D);
        expect(result).toEqual([
        ['A1', 'B1', 'C1'],
        ]);
    });
});


describe('getIndexCombinations', () => {
    test('returns an empty array when passed an empty array', () => {
        const result = getIndexCombinations([]);
        expect(result).toEqual([]);
    });
  
    test('returns the correct combinations for a 2D array with one inner array', () => {
        const array2D = [[1, 2, 3]];
        const result = getIndexCombinations(array2D);
        expect(result).toEqual([[0], [1], [2]]);
    });
  
    test('returns the correct combinations for a 2D array with multiple inner arrays', () => {
        const array2D = [[1, 2], [3, 4], [5, 6]];
        const result = getIndexCombinations(array2D);
        expect(result).toEqual([[0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1]]);
    });
  
    test('returns the correct combinations for a 2D array with different lengths of inner arrays', () => {
        const array2D = [[1], [2, 3], [4, 5, 6]];
        const result = getIndexCombinations(array2D);
        expect(result).toEqual([[0, 0, 0], [0, 0, 1], [0, 0, 2], [0, 1, 0], [0, 1, 1], [0, 1, 2]]);
    });
});

describe('getPossibleSchedules', () => {
    test('returns an empty array when no schedule combinations are provided', () => {
        const scheduleCombinations = [];
        const result = getPossibleSchedules(scheduleCombinations);
        expect(result).toEqual([]);
    });

    test('returns an empty array when all schedule combinations have conflicting times', () => {
        const scheduleCombinations = [
        [
            {
            days: 'M W F',
            startTime: '9:00 AM',
            endTime: '10:00 AM',
            },
            {
            days: 'M W F',
            startTime: '9:30 AM',
            endTime: '10:30 AM',
            },
        ],
        [
            {
            days: 'T R',
            startTime: '11:00 AM',
            endTime: '12:00 PM',
            },
            {
            days: 'T R',
            startTime: '11:30 AM',
            endTime: '12:30 PM',
            },
        ],
        ];
        const result = getPossibleSchedules(scheduleCombinations);
        expect(result).toEqual([]);
    });

    test('returns only schedule combinations with no conflicting times', () => {
        const scheduleCombinations = [
        [
            {
            days: 'M W F',
            startTime: '9:00 AM',
            endTime: '10:00 AM',
            },
            {
            days: 'T R',
            startTime: '11:00 AM',
            endTime: '12:00 PM',
            },
        ],
        [
            {
            days: 'M W F',
            startTime: '1:00 PM',
            endTime: '2:00 PM',
            },
            {
            days: 'T R',
            startTime: '2:00 PM',
            endTime: '3:00 PM',
            },
        ],
        ];
        const result = getPossibleSchedules(scheduleCombinations);
        expect(result).toEqual(scheduleCombinations);
    });
});

describe('sortByStartTime', () => {
    test('sorts courses by start time when start times are different', () => {
        const courses = [
            {
                days: 'M W F',
                startTime: '9:00 AM',
                endTime: '10:00 AM',
            },
            {
                days: 'T R',
                startTime: '11:00 AM',
                endTime: '12:00 PM',
            },
        ];
        const sortedCourses = sortByStartTime(courses);
        expect(sortedCourses[0].startTime).toBe('9:00 AM');
        expect(sortedCourses[1].startTime).toBe('11:00 AM');
    });

    test('sorts courses by day when start times are the same', () => {
        const courses = [
            {
                days: 'W',
                startTime: '10:00 AM',
                endTime: '11:00 AM',
            },
            {
                days: 'T',
                startTime: '10:00 AM',
                endTime: '11:00 AM',
            },
        ];
        const sortedCourses = sortByStartTime(courses);
        expect(sortedCourses[0].days).toBe('T');
        expect(sortedCourses[1].days).toBe('W');
    });

    test('sorts courses by both start time and day', () => {
        const courses = [
            {
                days: 'M',
                startTime: '9:00 AM',
                endTime: '10:00 AM',
            },
            {
                days: 'T',
                startTime: '8:30 AM',
                endTime: '9:30 AM',
            },
            {
                days: 'W',
                startTime: '9:00 AM',
                endTime: '10:00 AM',
            },
        ];
        const sortedCourses = sortByStartTime(courses);
        expect(sortedCourses[0].days).toBe('T');
        expect(sortedCourses[1].days).toBe('M');
        expect(sortedCourses[2].days).toBe('W');
    });
});


describe('hasConflictingTimes', () => {
    test('returns false when there are no conflicting times', () => {
        const courses = [
            {
                days: 'M W F',
                startTime: '9:00 AM',
                endTime: '10:00 AM',
            },
            {
                days: 'T R',
                startTime: '11:00 AM',
                endTime: '12:00 PM',
            },
        ];
        const result = hasConflictingTimes(courses);
        expect(result).toBe(false);
    });
    
    test('returns true when there are conflicting times on the same day', () => {
        const courses = [
            {
            days: 'M W F',
            startTime: '9:00 AM',
            endTime: '10:00 AM',
            },
            {
            days: 'M W F',
            startTime: '9:30 AM',
            endTime: '10:30 AM',
            },
        ];
        const result = hasConflictingTimes(courses);
        expect(result).toBe(true);
        });
    
    test('returns false when there are conflicting times on different days', () => {
        const courses = [
            {
                days: 'M W F',
                startTime: '9:00 AM',
                endTime: '10:00 AM',
            },
            {
                days: 'T R',
                startTime: '9:30 AM',
                endTime: '10:30 AM',
            },
        ];
        const result = hasConflictingTimes(courses);
        expect(result).toBe(false);
        });
    
    test('returns true when there are overlapping times for multiple courses', () => {
        const courses = [
            {
                days: 'M W F',
                startTime: '9:00 AM',
                endTime: '10:00 AM',
            },
            {
                days: 'W F',
                startTime: '9:30 AM',
                endTime: '10:30 AM',
            },
            {
                days: 'M W F',
                startTime: '10:30 AM',
                endTime: '11:30 AM',
            },
        ];
        const result = hasConflictingTimes(courses);
        expect(result).toBe(true);
    });
});
  

describe('hasTimeOverlap', () => {
  test('returns false when the courses have no day overlap', () => {
    const courseA = {
        days: 'M W F',
        startTime: '9:00 AM',
        endTime: '10:00 AM',
    };
    const courseB = {
        days: 'T R',
        startTime: '11:00 AM',
        endTime: '12:00 PM',
    };
    const result = hasTimeOverlap(courseA, courseB);
    expect(result).toBe(false);
  });

  test('returns false when the courses have day overlap but no time overlap', () => {
    const courseA = {
        days: 'M W F',
        startTime: '9:00 AM',
        endTime: '10:00 AM',
    };
    const courseB = {
        days: 'W F',
        startTime: '11:00 AM',
        endTime: '12:00 PM',
    };
    const result = hasTimeOverlap(courseA, courseB);
    expect(result).toBe(false);
  });

  test('returns true when the courses have day overlap and time overlap', () => {
    const courseA = {
        days: 'M W F',
        startTime: '9:00 AM',
        endTime: '10:00 AM',
    };
    const courseB = {
        days: 'W F',
        startTime: '9:30 AM',
        endTime: '10:30 AM',
    };
    const result = hasTimeOverlap(courseA, courseB);
    expect(result).toBe(true);
  });

  test('returns true when the courses have day overlap and one course is within the time range of the other', () => {
    const courseA = {
        days: 'M W F',
        startTime: '9:00 AM',
        endTime: '11:00 AM',
    };
    const courseB = {
        days: 'W F',
        startTime: '9:30 AM',
        endTime: '10:30 AM',
    };
    const result = hasTimeOverlap(courseA, courseB);
    expect(result).toBe(true);
  });
});
