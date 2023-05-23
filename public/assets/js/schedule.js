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
    console.log("populating", courses);
    for (let i = 0; i < courses.length; i++) {
        populateScheduleBlock(courses[i]);
    }
}

function populateScheduleBlock(course) {
    const scheduleBlockDiv = createScheduleBlockDiv(course);
    console.log(scheduleBlockDiv);
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
    const instructorParagraph = createParagraphElement(course.instructor);
    const locationParagraph = createParagraphElement(course.location);
    div.appendChild(sectionParagraph);
    div.appendChild(instructorParagraph);
    div.appendChild(locationParagraph);

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
    console.log("course", course);
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
    console.log("time", standardTime);
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

// Implementation
async function main() {
    const course1 = {
        courseSection: "COEN 10",
        courseName: "Introduction Comp",
        instructor: "Chirs Tamayo",
        units: "4",
        days: "T Th",
        startTime: "10:20 AM",
        endTime: "12:00 PM",
        location: "Kenna 103"
    }
    const course2 = {
        courseSection: "COEN 79",
        courseName: "Data Structs",
        instructor: "Shiv Jhalani",
        units: "4",
        days: "M W F",
        startTime: "2:15 PM",
        endTime: "3:30 PM",
        location: "O'Connor Hall 204"
    }
    // const csvFile = "../../misc/SCU_Find_Course_Sections_Fall_2023.csv";
    // courses = await csvFileToJSON(csvFile);
    // console.log(courses);
    // const testCourses = await [courses[0], courses[1], courses[2], courses[35]];
    // populateSchedule(testCourses);

    await connectToDatabase();
    const selectedCoursesData = await getAllObjectStoreData('selected');
    const selectedCoursesSections = getSelectedCoursesSections(selectedCoursesData);
    const scheduleCombinations = getAllCombinations(selectedCoursesSections);
    populateSchedule(scheduleCombinations[0]);
    console.log("selected course data", selectedCoursesData);
    console.log("selected course sections", selectedCoursesSections);
    console.log("all schedule combinations", scheduleCombinations);
    initializeScrollingCounter(scheduleCombinations);
    implementScrollingButtons(scheduleCombinations);
}

main();

module.exports = {
    convertMilitaryTimeToDecimal,
    convertStandardTimeToMilitaryTime,
    convertMinutesToDecimal
};
  