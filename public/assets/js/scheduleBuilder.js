const HOUR_BLOCK_HEIGHT = 60;

function populateSchedules(schedules) {
    if (schedules.length == 0) {
        populateEmptySchedule();
    } else {
        populateSchedule(schedules[0]);
        initializeScrollingCounter(schedules);
        implementScrollingButtons(schedules);
    }
}

function populateEmptySchedule() {
    const scheduleWrapper = document.querySelector(".schedule-wrapper");
    const scrollingButtons = document.querySelector(".scroll-buttons");
    scheduleWrapper.style.display = "none";
    scrollingButtons.style.display = "none";
    const mainElement = document.querySelector("main");
    const emptyParagraph = createParagraphElement("No possible schedules");
    emptyParagraph.style.fontWeight = "bold";
    mainElement.appendChild(emptyParagraph);
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

function getHours(militaryTime) {
    return parseInt(militaryTime / 100);
}

function getMinutes(militaryTime) {
    return (militaryTime % 100);
}

function convertMinutesToDecimal(minutes) {
    return (minutes / 60.0);
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

module.exports = {
    HOUR_BLOCK_HEIGHT,
    getScheduleBlockHeight,
    getTimeDifference,
    getMinutes,
    getHours,
    getScheduleBlockPadding,
    convertMilitaryTimeToDecimal,
    convertStandardTimeToMilitaryTime,
    convertMinutesToDecimal
};