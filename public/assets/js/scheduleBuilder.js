const HOUR_BLOCK_HEIGHT = 60;

/**
 * Populates the schedules based on the provided array of schedule combinations.
 *
 * @param {Array} schedules - An array of schedule combinations.
 */
function populateSchedules(schedules) {
    if (schedules.length == 0) {
        populateEmptySchedule();
    } else {
        populateSchedule(schedules[0]);
        initializeScrollingCounter(schedules);
        implementScrollingButtons(schedules);
    }
}

/**
 * Populates the schedule with message when there are no possible schedules.
 */
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

/**
 * Populates the schedule with the provided courses.
 *
 * @param {Array} courses - An array of course objects.
 */
function populateSchedule(courses) {
    clearSchedule();
    for (let i = 0; i < courses.length; i++) {
        populateScheduleBlock(courses[i]);
    }
}

/**
 * Populates a schedule block for a course in the schedule.
 *
 * @param {Object} course - The course object to populate.
 */
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

/**
 * Clears the schedule by removing all course blocks.
 */
function clearSchedule() {
    getDayDiv("monday").innerHTML = '';
    getDayDiv("tuesday").innerHTML = '';
    getDayDiv("wednesday").innerHTML = '';
    getDayDiv("thursday").innerHTML = '';
    getDayDiv("friday").innerHTML = '';
}

/**
 * Retrieves the day div element based on the given weekday ID.
 *
 * @param {string} weekdayId - The ID of the weekday div element.
 * @returns {Element} The day div element.
 */
function getDayDiv(weekdayId) {
    const dayDiv = document.querySelector("#" + weekdayId);
    return dayDiv;
}

/**
 * Creates a schedule block div element for the provided course.
 *
 * @param {Object} course - The course object.
 * @returns {Element} The created schedule block div element.
 */
function createScheduleBlockDiv(course) {
    const div = document.createElement("div");
    div.classList.add("course");
    const courseSection = course.name.split(" - ")[0]
    const sectionParagraph = createParagraphElement(courseSection);
    sectionParagraph.style.fontWeight = "bold";
    const timeRange = course.startTime + " - " + course.endTime;
    const timeParagraph = createParagraphElement(timeRange);
    const instructorParagraph = createParagraphElement(course.instructor);
    div.appendChild(sectionParagraph);
    div.appendChild(timeParagraph);
    div.appendChild(instructorParagraph);

    const height = getScheduleBlockHeight(course) + "px";
    const topPadding = getScheduleBlockPadding(course) + "px";
    div.style.height = height;
    div.style.top = topPadding;

    return div;
}

/**
 * Creates a paragraph element with the specified text content.
 *
 * @param {string} text - The text content of the paragraph.
 * @returns {Element} The created paragraph element.
 */
function createParagraphElement(text) {
    const paragraph = document.createElement("p");
    const textNode = document.createTextNode(text);
    paragraph.appendChild(textNode);
    return paragraph;
}

/**
 * Calculates the height of a schedule block based on the course's start and end time.
 *
 * @param {Object} course - The course object.
 * @returns {number} The height of the schedule block in pixels.
 */
function getScheduleBlockHeight(course) {
    const timeDifference = getTimeDifference(course.startTime, course.endTime);
    return (timeDifference) * HOUR_BLOCK_HEIGHT;
} 

/**
 * Calculates the time difference between two standard time values and returns it in decimal form.
 *
 * @param {string} startTime - The start time in standard format (e.g., "10:20 AM").
 * @param {string} endTime - The end time in standard format (e.g., "1:35 PM").
 * @returns {number} The time difference in decimal form (e.g., 1.25 for 1 hour 15 minutes).
 */
function getTimeDifference(startTime, endTime) {
    const militaryStartTime = convertStandardTimeToMilitaryTime(startTime);
    const militaryEndTime = convertStandardTimeToMilitaryTime(endTime);
    const startTimeDecimal = convertMilitaryTimeToDecimal(militaryStartTime);
    const endTimeDecimal = convertMilitaryTimeToDecimal(militaryEndTime);
    const timeDifference = endTimeDecimal - startTimeDecimal;
    return timeDifference;
}

/**
 * Calculates the top padding of a schedule block based on the course's start time.
 *
 * @param {Object} course - The course object.
 * @returns {number} The top padding of the schedule block in pixels.
 */
function getScheduleBlockPadding(course) {
    const militaryStartTime = convertStandardTimeToMilitaryTime(course.startTime);
    const decimalStartTime = convertMilitaryTimeToDecimal(militaryStartTime);
    return (decimalStartTime-7) * HOUR_BLOCK_HEIGHT;
}

/**
 * Converts military time to decimal form.
 *
 * @param {number} militaryTime - The military time as a number.
 * @returns {number} The military time in decimal form.
 */
function convertMilitaryTimeToDecimal(militaryTime) {
    const hour = getHours(militaryTime);
    const minute = getMinutes(militaryTime);
    const minuteDecimal = convertMinutesToDecimal(minute);
    return (hour + minuteDecimal);
}

/**
 * Extracts the hour from the military time.
 *
 * @param {number} militaryTime - The military time as a number.
 * @returns {number} The hour part of the military time.
 */
function getHours(militaryTime) {
    return parseInt(militaryTime / 100);
}

/**
 * Extracts the minutes from the military time.
 *
 * @param {number} militaryTime - The military time as a number.
 * @returns {number} The minute part of the military time.
 */
function getMinutes(militaryTime) {
    return (militaryTime % 100);
}

/**
 * Converts minutes to decimal form.
 *
 * @param {number} minutes - The minutes to convert.
 * @returns {number} The minutes in decimal form.
 */
function convertMinutesToDecimal(minutes) {
    return (minutes / 60.0);
}

/**
 * Converts a standard time string to military time as a number.
 *
 * @param {string} standardTime - The standard time string.
 * @returns {number} The military time as a number.
 */
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

/**
 * Initializes the scrolling counter element with the current schedule index and the total number of schedules.
 *
 * @param {Array} schedules - An array of schedule combinations.
 */
let scheduleIndex = 1;
function initializeScrollingCounter(schedules) {
    const total = schedules.length;
    const paragraphElement = document.querySelector(".schedule-counter");
    paragraphElement.innerHTML = '';
    const text = scheduleIndex + " / " + total;
    const textNode = document.createTextNode(text);
    paragraphElement.appendChild(textNode);
}

/**
 * Implements the functionality of the scrolling buttons for navigating through the schedules.
 *
 * @param {Array} schedules - An array of schedule combinations.
 */
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