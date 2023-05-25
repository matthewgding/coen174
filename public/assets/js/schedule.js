const HOUR_BLOCK_HEIGHT = 60;

async function csvFileToJSON(csv) {
    const response = await fetch(csv);
    const data = await response.text();
    const lines = data.split("\n");
    const headers = lines[0].split(",");
    const result = [];
    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}

// courses is an array of the course object
function populateSchedule(courses) {
    clearSchedule();
    for (let i = 0; i < courses.length; i++) {
        populateScheduleBlock(courses[i]);
    }
}

function populateScheduleBlock(course) {
    const scheduleBlockDiv = createScheduleBlockDiv(course);
    const daysArray = course.days.split(" ");
    if (daysArray.includes("M")) {
        const dayDiv = getDayDiv("monday");
        dayDiv.appendChild(scheduleBlockDiv.cloneNode(true));
    } 
    if(daysArray.includes("T")) {
        const dayDiv = getDayDiv("tuesday");
        dayDiv.appendChild(scheduleBlockDiv.cloneNode(true));
    }
    if(daysArray.includes("W")) {
        const dayDiv = getDayDiv("wednesday");
        dayDiv.appendChild(scheduleBlockDiv.cloneNode(true));
    } 
    if(daysArray.includes("Th")) {
        const dayDiv = getDayDiv("thursday");
        dayDiv.appendChild(scheduleBlockDiv.cloneNode(true));
    } 
    if(daysArray.includes("F")) {
        const dayDiv = getDayDiv("friday");
        dayDiv.appendChild(scheduleBlockDiv.cloneNode(true));
    } 
}

function clearSchedule() {
    getDayDiv("monday").innerHTML = '';
    getDayDiv("tuesday").innerHTML = '';
    getDayDiv("wednesday").innerHTML = '';
    getDayDiv("thursday").innerHTML = '';
    getDayDiv("friday").innerHTML = '';
}

function getDayDiv(weekdayId) {
    const dayDiv = document.querySelector("#" + weekdayId);
    return dayDiv;
}

function createScheduleBlockDiv(course) {
    const div = document.createElement("div");
    div.classList.add("course");
    const courseSection = course.name.split(" - ")[0]
    const sectionParagraph = createParagraphElement(courseSection);
    sectionParagraph.style.fontWeight = "bold";
    const timeRange = course.startTime + " - " + course.endTime;
    const timeParagraph = createParagraphElement(timeRange);
    const instructorParagraph = createParagraphElement(course.instructor);
    //const locationParagraph = createParagraphElement(course.location);
    div.appendChild(sectionParagraph);
    div.appendChild(timeParagraph);
    div.appendChild(instructorParagraph);
    //div.appendChild(locationParagraph);

    const height = getScheduleBlockHeight(course) + "px";
    const topPadding = getScheduleBlockPadding(course) + "px";
    div.style.height = height;
    div.style.top = topPadding;

    return div;
}

function createParagraphElement(text) {
    const paragraph = document.createElement("p");
    const textNode = document.createTextNode(text);
    paragraph.appendChild(textNode);
    return paragraph;
}

function getScheduleBlockHeight(course) {
    const timeDifference = getTimeDifference(course.startTime, course.endTime);
    return (timeDifference) * HOUR_BLOCK_HEIGHT;
} 

// startTime and endTime are in standard time (ex. 10:20 AM)
// return in decimal form (1 hour 15 minutes = 1.25)
function getTimeDifference(startTime, endTime) {
    const militaryStartTime = convertStandardTimeToMilitaryTime(startTime);
    const militaryEndTime = convertStandardTimeToMilitaryTime(endTime);
    const startTimeDecimal = convertMilitaryTimeToDecimal(militaryStartTime);
    const endTimeDecimal = convertMilitaryTimeToDecimal(militaryEndTime);
    const timeDifference = endTimeDecimal - startTimeDecimal;
    return timeDifference;
}

function getMinutes(time) {
    return (time % 100);
}

function getHours(time) {
    return parseInt(time / 100);
}

function getScheduleBlockPadding(course) {
    const militaryStartTime = convertStandardTimeToMilitaryTime(course.startTime);
    const decimalStartTime = convertMilitaryTimeToDecimal(militaryStartTime);
    return (decimalStartTime-7) * HOUR_BLOCK_HEIGHT;
}

function convertMilitaryTimeToDecimal(militaryTime) {
    const hour = getHours(militaryTime);
    const minute = getMinutes(militaryTime);
    const minuteDecimal = convertMinutesToDecimal(minute);
    return (hour + minuteDecimal);
}

// Return military time as number
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

function convertMinutesToDecimal(minutes) {
    return (minutes / 60.0);
}

function getSelectedCoursesSections(selectedCoursesData) {
    let selectedCoursesSections = [];
    for (let i = 0; i < selectedCoursesData.length; ++i) {
        selectedCoursesSections.push(selectedCoursesData[i].sections);
    }
    return selectedCoursesSections;
}

function getAllCombinations(array2D) {
    const indexCombinations = getIndexCombinations(array2D);
    console.log("indexcombos", indexCombinations);
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

let scheduleIndex = 1;
function initializeScrollingCounter(schedules) {
    const total = schedules.length;
    const paragraphElement = document.querySelector(".schedule-counter");
    paragraphElement.innerHTML = '';
    const text = scheduleIndex + " / " + total;
    const textNode = document.createTextNode(text);
    paragraphElement.appendChild(textNode);
}

function implementScrollingButtons(schedules) {
    const total = schedules.length;
    const paragraphElement = document.querySelector(".schedule-counter");
    const leftButton = document.querySelector(".left-btn");
    leftButton.addEventListener('click', () => {
        if (--scheduleIndex == 0) scheduleIndex = total;
        populateSchedule(schedules[scheduleIndex-1]);
        paragraphElement.innerHTML = '';
        const text = scheduleIndex + " / " + total;
        const textNode = document.createTextNode(text);
        paragraphElement.appendChild(textNode);
    })
    const rightButton = document.querySelector(".right-btn");
    rightButton.addEventListener('click', () => {
        if (++scheduleIndex == total+1) scheduleIndex = 1;
        populateSchedule(schedules[scheduleIndex-1]);
        paragraphElement.innerHTML = '';
        const text = scheduleIndex + " / " + total;
        const textNode = document.createTextNode(text);
        paragraphElement.appendChild(textNode);
    })
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

function populateSchedules(schedules) {
    if (schedules.length == 0) {

    }
}

// Implementation
async function main() {
    await connectToDatabase();
    const selectedCoursesData = await getAllObjectStoreData('selected');
    console.log("selected course data", selectedCoursesData);

    const selectedCoursesSections = getSelectedCoursesSections(selectedCoursesData);
    console.log("selected course sections", selectedCoursesSections);

    const scheduleCombinations = getAllCombinations(selectedCoursesSections);
    console.log("all schedule combinations", scheduleCombinations);

    const possibleSchedules = getPossibleSchedules(scheduleCombinations);
    console.log("possible schedules", possibleSchedules);

    populateSchedules(possibleSchedules);
    populateSchedule(possibleSchedules[0]);
    initializeScrollingCounter(possibleSchedules);
    implementScrollingButtons(possibleSchedules);
}

main();

module.exports = {
    convertMilitaryTimeToDecimal,
    convertStandardTimeToMilitaryTime,
    convertMinutesToDecimal
};
  