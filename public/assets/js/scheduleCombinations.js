function getAllCombinations(array2D) {
    const indexCombinations = getIndexCombinations(array2D);
    let allCombinations = [];
    for (let i = 0; i < indexCombinations.length; i++) {
        const indexCombination = indexCombinations[i];
        let combination = [];
        for (let row = 0; row < indexCombination.length; row++) {
            const index = indexCombination[row];
            combination.push(array2D[row][index]);
        }
        allCombinations.push(combination);
    }
    return allCombinations;
}

// Function to generate array of combinations that
// contain indices representing one element from
// each of the given arrays of objects
function getIndexCombinations(array2D) {
    // Array of resulting combinations
    let combinations = new Array();

    if (array2D.length == 0) return combinations;
    // Number of arrays
    let n = array2D.length;

    // Create array parralel to courses with data
    // entries being indices
    let arr = new Array(n);
    for (let i = 0; i < n; i++) {
        let temp = new Array(array2D[i].length);
        for (let j = 0; j < temp.length; j++) {
            temp[j] = j;
        }
        arr[i] = temp;
    }

    // To keep track of next element in
    // each of the n arrays
    let indices = new Array(n);

    // Initialize with first element's index
    for(let i = 0; i < n; i++)
        indices[i] = 0;

    let comboIndex = 0;
    while (true)
    {
        let combo = new Array(n);

        // Add current combination
        for(let i = 0; i < n; i++)
            combo[i] = (arr[i][indices[i]]);

        combinations[comboIndex] = combo;
        comboIndex++;

        // Find the rightmost array that has more
        // elements left after the current element
        // in that array
        let next = n - 1;
        while (next >= 0 && (indices[next] + 1 >=
            arr[next].length))
            next--;

        // No such array is found so no more
        // combinations left
        if (next < 0)
            break;

        // If found move to next element in that
        // array
        indices[next]++;

        // For all arrays to the right of this
        // array current index again points to
        // first element
        for(let i = next + 1; i < n; i++)
            indices[i] = 0;
    }
    return combinations;
}


function getPossibleSchedules(scheduleCombinations) {
    let possibleSchedules = [];
    for (let scheduleCombination of scheduleCombinations) {
        if (!hasConflictingTimes(scheduleCombination)) {
            possibleSchedules.push(scheduleCombination);
        }
    }
    return possibleSchedules;
}


/* Function to sort courses by their start times. 
   It prioritizes the start time first, then the day.
*/
function sortByStartTime(courses) {
    return courses.sort((courseA, courseB) => {
      const timeA = convertStandardTimeToMilitaryTime(courseA.startTime);
      const timeB = convertStandardTimeToMilitaryTime(courseB.startTime);
  
      if (timeA !== timeB) {
        return timeA - timeB; // Sort by start time
      } else {
        const dayOrder = ['M', 'T', 'W', 'Th', 'F']; // Define the order of days
  
        const dayA = dayOrder.indexOf(courseA.days[0]);
        const dayB = dayOrder.indexOf(courseB.days[0]);
  
        return dayA - dayB; // Sort by day
      }
    });
}

/* Function to check if there are conflicting times between the courses.
   First iterates through each day of the week and filters the courses
   scheduled on that day. 
   Then sorts the filtered courses by start time.
   Finally, iterates through the sorted courses to check for time overlaps.
   Returns true if there is a time conflict and false if not.
*/
function hasConflictingTimes(courses) {
    const daysOfWeek = ['M', 'T', 'W', 'Th', 'F'];
  
    for (let day of daysOfWeek) {
      const coursesOnDay = courses.filter(course => course.days.includes(day));
  
      const sortedCourses = coursesOnDay.sort((courseA, courseB) => {
        const timeA = convertStandardTimeToMilitaryTime(courseA.startTime);
        const timeB = convertStandardTimeToMilitaryTime(courseB.startTime);
        return timeA - timeB;
      });
  
      for (let i = 0; i < sortedCourses.length - 1; i++) {
        const currentCourse = sortedCourses[i];
        const nextCourse = sortedCourses[i + 1];
  
        if (hasTimeOverlap(currentCourse, nextCourse)) {
          return true; // Conflicting times found
        }
      }
    }
  
    return false; // No conflicting times found
}
  
/* Function to check between two courses.
   First checks if there is a day overlap between the courses.
   If there is a day overlap, it compares the start and end times 
   to determine if there is a time overlap.
   Returns true if there is a time overlap and false or not.
   This serves as a helper function for hasConflictingTimes.
*/
function hasTimeOverlap(courseA, courseB) {
    const daysA = courseA.days;
    const daysAArray = daysA.split(" ");
    const daysB = courseB.days;
    const daysBArray = daysB.split(" ");
    const startTimeA = convertStandardTimeToMilitaryTime(courseA.startTime);
    const endTimeA = convertStandardTimeToMilitaryTime(courseA.endTime);
    const startTimeB = convertStandardTimeToMilitaryTime(courseB.startTime);
    const endTimeB = convertStandardTimeToMilitaryTime(courseB.endTime);

    // Check if any of the days overlap
    const hasDayOverlap = daysAArray.some(day => daysBArray.includes(day));
  
    // Check for time overlap if the days overlap
    if (hasDayOverlap) {
      return (startTimeA <= endTimeB && endTimeA >= startTimeB);
    }
  
    return false;
}

function convertStandardTimeToMilitaryTime(standardTime) {
    const time = standardTime.split(" ")[0];
    let hour = time.split(":")[0];
    const minute = time.split(":")[1];
    const meridiem = standardTime.split(" ")[1];    

    if (meridiem === "PM" && hour < 12) {
        hour = parseInt(hour) + 12;
    }
    if (meridiem == "AM" && hour == 12) {
        hour = 0;
    }

    return (parseInt(hour) * 100) + parseInt(minute);
}   

module.exports = {
    getAllCombinations,
    getIndexCombinations,
    getPossibleSchedules,
    sortByStartTime,
    hasConflictingTimes,
    hasTimeOverlap
}