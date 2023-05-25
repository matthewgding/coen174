/* Function to sort courses by their start times. 
   It prioritizes the start time first, then the day.
*/

function sortByStartTime(courses) {
    return courses.sort((courseA, courseB) => {
      const timeA = convertTimeTo24Hour(courseA.startTime);
      const timeB = convertTimeTo24Hour(courseB.startTime);
  
      if (timeA !== timeB) {
        return timeA - timeB; // Sort by start time
      } else {
        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']; // Define the order of days
  
        const dayA = dayOrder.indexOf(courseA.days[0]);
        const dayB = dayOrder.indexOf(courseB.days[0]);
  
        return dayA - dayB; // Sort by day
      }
    });
}

/* Function to convert time from AM / PM to 24 hour format.
   This serves as a helper function for hasConflictingTimes,
   as it depends on comparing the start and end times numerically.
*/

// ! was not sure if needed maybe could have just used the given military time ?
function convertTimeTo24Hour(time) {
    const [hour, minute, period] = time.split(/:| /);
    let hour24 = parseInt(hour, 10);
  
    if (period === 'PM' && hour !== '12') {
      hour24 += 12;
    }
  
    return hour24 * 100 + parseInt(minute, 10);
}

/* Function to check if there are conflicting times between the courses.
   First iterates through each day of the week and filters the courses
   scheduled on that day. 
   Then sorts the filtered courses by start time.
   Finally, iterates through the sorted courses to check for time overlaps.
   Returns true if there is a time conflict and false if not.
*/
function hasConflictingTimes(courses) {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
    for (let day of daysOfWeek) {
      const coursesOnDay = courses.filter(course => course.days.includes(day));
  
      const sortedCourses = coursesOnDay.sort((courseA, courseB) => {
        const timeA = convertTimeTo24Hour(courseA.startTime);
        const timeB = convertTimeTo24Hour(courseB.startTime);
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
    const daysB = courseB.days;
    const startTimeA = convertTimeTo24Hour(courseA.startTime);
    const endTimeA = convertTimeTo24Hour(courseA.endTime);
    const startTimeB = convertTimeTo24Hour(courseB.startTime);
    const endTimeB = convertTimeTo24Hour(courseB.endTime);
  
    // Check if any of the days overlap
    const hasDayOverlap = daysA.some(day => daysB.includes(day));
  
    // Check for time overlap if the days overlap
    if (hasDayOverlap) {
      return (startTimeA <= endTimeB && endTimeA >= startTimeB);
    }
  
    return false;
}

async function main() {
    const dummyCourses = [
        {
          name: 'Course A',
          days: ['Monday', 'Tuesday'],
          startTime: '10:00 AM',
          endTime: '11:00 AM'
        },
        {
          name: 'Course B',
          days: ['Monday'],
          startTime: '11:05 AM',
          endTime: '11:30 AM'
        },
        {
          name: 'Course C',
          days: ['Tuesday', 'Wednesday'],
          startTime: '12:00 PM',
          endTime: '1:30 PM'
        }
      ];

    console.log(dummyCourses);
    const sortedCourses = sortByStartTime(dummyCourses);
    console.log(sortedCourses);
    const hasConflicts = hasConflictingTimes(sortedCourses);
    console.log(hasConflicts); // should return false

    const dummyCourses2 = [
        {
          name: 'Course A',
          days: ['Monday', 'Tuesday'],
          startTime: '10:00 AM',
          endTime: '11:00 AM'
        },
        {
          name: 'Course B',
          days: ['Monday'],
          startTime: '11:00 AM',
          endTime: '11:30 AM'
        },
        {
          name: 'Course C',
          days: ['Tuesday', 'Wednesday'],
          startTime: '12:00 PM',
          endTime: '1:30 PM'
        }
      ];

    console.log(dummyCourses2);
    const sortedCourses2 = sortByStartTime(dummyCourses2);
    console.log(sortedCourses2);
    const hasConflicts2 = hasConflictingTimes(sortedCourses2);
    console.log(hasConflicts2); // should return true because course A and course B have conflict at 11:00 A.M. on Monday   
    
    const dummyCourses3 = [
        {
          name: 'Course A',
          days: ['Monday', 'Tuesday'],
          startTime: '10:00 AM',
          endTime: '11:00 AM'
        },
        {
          name: 'Course B',
          days: ['Friday'],
          startTime: '10:00 AM',
          endTime: '11:00 AM'
        },
        {
          name: 'Course C',
          days: ['Wednesday'],
          startTime: '10:00 AM',
          endTime: '11:00 AM'
        }
      ];
      
    console.log(dummyCourses3);
    const sortedCourses3 = sortByStartTime(dummyCourses3);
    console.log(sortedCourses3);
    const hasConflicts3 = hasConflictingTimes(sortedCourses3);
    console.log(hasConflicts3); // should return false because even though courses are during same times, they are on different days
}

main();


