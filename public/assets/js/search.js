let courses = [];
let searchList = [];
let searchListCourseSections = [];
let selectedCourses = [];

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

function populateSearchCourseList() {
    const searchListElement = document.querySelector(".search-course-list");
    courses.forEach(course => {
        if (!searchListCourseSections.includes(course.courseSection)) {
            const courseCard = createCourseCard(course);
            searchListElement.appendChild(courseCard);
            searchList.push({
                section: course.courseSection,
                name: course.courseName,
                fullName: course.courseSection + " - " + course.courseName, 
                isSelected: false, 
                element: courseCard
            });
            searchListCourseSections.push(course.courseSection);
        }
    })
    console.log(searchList);
}

function addSearchCourse(course) {
    const searchList = document.querySelector(".search-course-list");
    searchList.appendChild(course.element);
}

function createCourseCard(course) {
    const courseCard = document.createElement("div");
    courseCard.classList.add("course-card");
    courseCard.appendChild(createCourseDiv(course));
    courseCard.appendChild(createCourseAddButton());
    return courseCard;
}

function createCourseDiv(course) {
    const courseDiv = document.createElement("div");
    courseDiv.classList.add("search-course");
    courseDiv.appendChild(createCourseParagraph("course-name", course.courseSection + " - " + course.courseName));
    return courseDiv;
}

function createCourseParagraph(className, text) {
    const courseParagraph = document.createElement("p");
    const textNode = document.createTextNode(text);
    courseParagraph.classList.add(className);
    courseParagraph.appendChild(textNode);
    return courseParagraph;
}

function createCourseAddButton() {
    const courseButton = document.createElement("button");
    courseButton.classList.add("add-button");
    courseButton.textContent = "Add";

    // When clicked, add to course selected list
    courseButton.addEventListener("click", () => {
        const courseDiv = courseButton.parentElement.firstChild;
        const courseName = courseDiv.querySelector(".course-name").textContent;
        searchList.forEach(listCourse => {
            if (listCourse.fullName === courseName) {
                if (listCourse.isSelected == false) {
                    courseButton.textContent = "Remove";
                    addSelectedCourse(listCourse);
                } else {
                    courseButton.textContent = "Add";
                    removeSelectedCourse(listCourse);
                }
            }
        })
    })
    return courseButton;
}

function addSelectedCourse(listCourse) {
    if (!selectedCourses.includes(listCourse)) {
        listCourse.isSelected = true;
        selectedCourses.push(listCourse);
        populateSelectedCourseList();
    }
}

function removeSelectedCourse(listCourse) {
    listCourse.isSelected = false;
    selectedCourses.forEach(selectedCourse => {
        if (selectedCourse.fullName === listCourse.fullName) {
            const index = selectedCourses.indexOf(selectedCourse);
            selectedCourses.splice(index, 1);
            selectedCourse.isSelected = false;
            addSearchCourse(selectedCourse);
        }
    })
    populateSelectedCourseList();
}

function populateSelectedCourseList() {
    const selectedCoursesList = document.querySelector(".selected-course-list");
    selectedCourses.forEach(selectedCourse => {
        selectedCoursesList.appendChild(selectedCourse.element);
    });
}

function implementSearchBar() {
    const searchInput = document.querySelector("#search-input");
    searchInput.addEventListener("input", e => {
        const value = e.target.value.toLowerCase();
        console.log(value);
        searchList.forEach(listCourse => {
            let isVisible = listCourse.fullName.toLowerCase().includes(value);
            if (listCourse.isSelected) isVisible = true;
            listCourse.element.classList.toggle("hide", !isVisible);
        })
    });
}

// Implementation
async function main() {
    const csvFile = "../../misc/SCU_Find_Course_Sections_Fall_2023.csv";
    courses = await csvFileToJSON(csvFile);
    console.log(courses);
    implementSearchBar();
    populateSearchCourseList();
}

main();