const searchInput = document.querySelector("#search-input");

let data = [];
let courses = [];
let selectedCourses = [];

function importData() {
    data.push({name: "COEN 122 - Computer Architecture", professor: "Professor", times: "MWF, 9:15am - 10:20am", location: "Location"});
    data.push({name: "COEN 177 - Operating Systems", professor: "Professor", times: "MWF, 9:15am - 10:20am", location: "Location"});
    data.push({name: "COEN 79 - OO and Data Structures", professor: "Professor", times: "MWF, 9:15am - 10:20am", location: "Location"});
    data.push({name: "COEN 20 - Assembly", professor: "Professor", times: "MWF, 9:15am - 10:20am", location: "Location"});
}

function populateSearchCourseList() {
    const searchList = document.querySelector(".search-course-list");
    data.forEach(course => {
        const courseCard = createCourseCard(course);
        searchList.appendChild(courseCard);
        console.log(courseCard);
        courses.push({
            name: course.name, 
            professor: course.professor, 
            times: course.times, 
            location: course.location, 
            isSelected: false, 
            element: courseCard
        });
    })
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
    courseDiv.appendChild(createCourseParagraph("course-name", course.name));
    courseDiv.appendChild(createCourseParagraph("course-professor", course.professor));
    courseDiv.appendChild(createCourseParagraph("course-times", course.times));
    courseDiv.appendChild(createCourseParagraph("course-location", course.location));
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
        courses.forEach(course => {
            if (course.name === courseName) {
                if (course.isSelected == false) {
                    courseButton.textContent = "Remove";
                    addSelectedCourse(course);
                } else {
                    courseButton.textContent = "Add";
                    removeSelectedCourse(course);
                }
            }
        })
    })
    return courseButton;
}

function addSelectedCourse(course) {
    if (!selectedCourses.includes(course)) {
        course.isSelected = true;
        selectedCourses.push(course);
        populateSelectedCourseList();
    }
    console.log(selectedCourses);
}

function removeSelectedCourse(course) {
    course.isSelected = false;
    selectedCourses.forEach(selectedCourse => {
        if (selectedCourse.name === course.name) {
            const index = selectedCourses.indexOf(selectedCourse);
            selectedCourses.splice(index, 1);
            addSearchCourse(selectedCourse);
        }
    })
    populateSelectedCourseList();
    console.log(selectedCourses);
}

function populateSelectedCourseList() {
    const selectedCoursesList = document.querySelector(".selected-course-list");
    selectedCourses.forEach(selectedCourse => {
        selectedCoursesList.appendChild(selectedCourse.element);
    });
}

searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    console.log(value);
    console.log(courses);
    courses.forEach(course => {
        const isVisible = course.name.toLowerCase().includes(value);
        console.log(course.element);
        course.element.classList.toggle("hide", !isVisible);
    })
});

function main() {
    console.log("HI");
} 


// Implementation
importData();
populateSearchCourseList();
main();