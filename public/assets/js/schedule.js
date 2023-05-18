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
    for (let i = 0; i < courses.length; i++) {
        populateScheduleBlock(courses[i]);
    }
}

function populateScheduleBlock(course) {
    console.log("populatescheduleblock");
    console.log("course", course);
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

function getDayDiv(weekdayId) {
    const dayDiv = document.querySelector("#" + weekdayId);
    return dayDiv;
}

function createScheduleBlockDiv(course) {
    const div = document.createElement("div");
    div.classList.add("course");
    const sectionParagraph = createParagraphElement(course.courseSection);
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

console.log(convertStandardTimeToMilitaryTime("10:20 AM"));
console.log(convertStandardTimeToMilitaryTime("12:20 PM"));
console.log(convertStandardTimeToMilitaryTime("1:49 PM"));
console.log(convertStandardTimeToMilitaryTime("11:05 PM"));
console.log(convertStandardTimeToMilitaryTime("12:20 AM"));

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
    console.log(test);

    console.log(courses);
    console.log(selectedCourses);
    // const testCourses = await [courses[0], courses[1], courses[2], courses[35]];
    // populateSchedule(testCourses);
}

main();

module.exports = {
    convertMilitaryTimeToDecimal,
    convertStandardTimeToMilitaryTime,
    convertMinutesToDecimal
  };