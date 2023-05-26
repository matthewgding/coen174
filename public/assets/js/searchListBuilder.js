let selectedCoursesList = [];
let searchList = [];

// Courses is an array of objects in form of {name: __, sections: [...]}
async function populateSearchCourseList(objectStoreCourses) {
    const searchListElement = document.querySelector(".search-course-list");
    objectStoreCourses.forEach(course => {
        const courseCard = createCourseCard(course);
        searchListElement.appendChild(courseCard);
        searchList.push({
            name: course.name,
            isSelected: false, 
            element: courseCard
        });
    })
    console.log("Search List:", searchList);
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
        searchList.forEach(async listCourse => {
            if (listCourse.name === courseName) {
                if (listCourse.isSelected == false) {
                    addSelectedCourse(listCourse);
                    await uploadSelectedCourse(listCourse);
                } else {
                    courseButton.textContent = "Add";
                    removeSelectedCourse(listCourse);
                    deleteSelectedCourse(listCourse);
                }
            }
        })
    })
    return courseButton;
}

async function addSelectedCourse(listCourse) {
    listCourse.element.querySelector(".add-button").textContent = "Remove";
    listCourse.isSelected = true;
    selectedCoursesList.push(listCourse);
    populateSelectedCourseList();
}

async function uploadSelectedCourse(listCourse) {
    const courseData = await getObjectByKey("courses", listCourse.name);
    const transaction = db.transaction('selected', 'readwrite');
    const objectStore = transaction.objectStore('selected');
    await objectStore.put(courseData, courseData.name);
    console.log("Add: ", await getAllObjectStoreData('selected'));
}

function removeSelectedCourse(listCourse) {
    listCourse.isSelected = false;
    selectedCoursesList.forEach(selectedCourse => {
        if (selectedCourse.name === listCourse.name) {
            const index = selectedCoursesList.indexOf(selectedCourse);
            selectedCoursesList.splice(index, 1);
            selectedCourse.isSelected = false;
            addSearchCourse(selectedCourse);
        }
    })
    populateSelectedCourseList();
}

async function deleteSelectedCourse(listCourse) {
    const transaction = db.transaction('selected', 'readwrite');
    const objectStore = transaction.objectStore('selected');
    objectStore.delete(listCourse.name);
    console.log("Delete:", await getAllObjectStoreData('selected'));
}

function getObjectByKey(objectStoreName, key) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(objectStoreName, 'readonly');
      const objectStore = transaction.objectStore(objectStoreName);
      const getRequest = objectStore.get(key);
  
      getRequest.onsuccess = function(event) {
        const result = event.target.result;
        resolve(result);
      };
  
      getRequest.onerror = function(event) {
        console.error('Failed to retrieve object:', event.target.errorCode);
        reject(new Error('Failed to retrieve object'));
      };
    });
  }

function populateSelectedCourseList() {
    const selectedCoursesListElement = document.querySelector(".selected-course-list");
    selectedCoursesList.forEach(selectedCourse => {
        selectedCoursesListElement.appendChild(selectedCourse.element);
    });
}

function implementSearchBar() {
    const searchInput = document.querySelector("#search-input");
    searchInput.addEventListener("input", e => {
        const value = e.target.value.toLowerCase();
        console.log(value);
        searchList.forEach(listCourse => {
            let isVisible = listCourse.name.toLowerCase().includes(value);
            if (listCourse.isSelected) isVisible = true;
            listCourse.element.classList.toggle("hide", !isVisible);
        })
    });
}

async function initializeSelectedCoursesList() {
    const selectedCoursesData = await getAllObjectStoreData('selected');
    selectedCoursesData.forEach(selectedCourse => {
        const name = selectedCourse.name;
        const listCourse = findListCourse(name);
        addSelectedCourse(listCourse);
    })
}

function findListCourse(name) {
    const foundCourse = searchList.find(listCourse => listCourse.name === name);
    if (foundCourse) {
      return foundCourse;
    }
    return null; // Return null if the course is not found
}