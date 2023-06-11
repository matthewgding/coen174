let selectedCoursesList = [];
let searchList = [];

/**
 * Populates the search course list by creating course cards for each course in the object store and adding them to the DOM.
 *
 * @param {Array} objectStoreCourses - An array of courses in the form of {name: __, sections: [...]}.
 * @returns {Promise<void>} A promise that resolves after populating the search course list.
 */
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

/**
 * Adds a search course to the search course list.
 *
 * @param {Object} course - The course object to add to the search course list.
 */
function addSearchCourse(course) {
    const searchList = document.querySelector(".search-course-list");
    searchList.appendChild(course.element);
}

/**
 * Creates a course card element based on the provided course object.
 *
 * @param {Object} course - The course object to create a card for.
 * @returns {HTMLElement} The created course card element.
 */
function createCourseCard(course) {
    const courseCard = document.createElement("div");
    courseCard.classList.add("course-card");
    courseCard.appendChild(createCourseDiv(course));
    courseCard.appendChild(createCourseAddButton());
    return courseCard;
}

/**
 * Creates a course div element for the provided course object.
 *
 * @param {Object} course - The course object to create a div for.
 * @returns {HTMLElement} The created course div element.
 */
function createCourseDiv(course) {
    const courseDiv = document.createElement("div");
    courseDiv.classList.add("search-course");
    courseDiv.appendChild(createCourseParagraph("course-name", course.name));
    return courseDiv;
}

/**
 * Creates a paragraph element with the specified class and text content.
 *
 * @param {string} className - The class name for the paragraph element.
 * @param {string} text - The text content of the paragraph element.
 * @returns {HTMLElement} The created paragraph element.
 */
function createCourseParagraph(className, text) {
    const courseParagraph = document.createElement("p");
    const textNode = document.createTextNode(text);
    courseParagraph.classList.add(className);
    courseParagraph.appendChild(textNode);
    return courseParagraph;
}

/**
 * Creates an "Add" button element for the course card.
 *
 * @returns {HTMLElement} The created "Add" button element.
 */
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

/**
 * Adds the selected course to the selected courses list and updates the UI accordingly.
 *
 * @param {Object} listCourse - The selected course object to add.
 * @returns {Promise<void>} A promise that resolves after adding the selected course.
 */
async function addSelectedCourse(listCourse) {
    listCourse.element.querySelector(".add-button").textContent = "Remove";
    listCourse.isSelected = true;
    selectedCoursesList.push(listCourse);
    populateSelectedCourseList();
}

/**
 * Uploads the selected course to the "selected" object store in the database.
 *
 * @param {Object} listCourse - The selected course object to upload.
 * @returns {Promise<void>} A promise that resolves after uploading the selected course.
 */
async function uploadSelectedCourse(listCourse) {
    const courseData = await getObjectByKey("courses", listCourse.name);
    const transaction = db.transaction('selected', 'readwrite');
    const objectStore = transaction.objectStore('selected');
    await objectStore.put(courseData, courseData.name);
    console.log("Add: ", await getAllObjectStoreData('selected'));
}

/**
 * Removes the selected course from the selected courses list and updates the UI accordingly.
 *
 * @param {Object} listCourse - The selected course object to remove.
 */
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

/**
 * Deletes the selected course from the "selected" object store in the database.
 *
 * @param {Object} listCourse - The selected course object to delete.
 */
async function deleteSelectedCourse(listCourse) {
    const transaction = db.transaction('selected', 'readwrite');
    const objectStore = transaction.objectStore('selected');
    objectStore.delete(listCourse.name);
    console.log("Delete:", await getAllObjectStoreData('selected'));
}

/**
 * Retrieves an object from the specified object store in the database by its key.
 *
 * @param {string} objectStoreName - The name of the object store to retrieve the object from.
 * @param {string} key - The key of the object to retrieve.
 * @returns {Promise<Object>} A promise that resolves with the retrieved object.
 */
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

/**
 * Populates the selected course list by appending the selected course elements to the DOM.
 */
function populateSelectedCourseList() {
    const selectedCoursesListElement = document.querySelector(".selected-course-list");
    selectedCoursesList.forEach(selectedCourse => {
        selectedCoursesListElement.appendChild(selectedCourse.element);
    });
}

/**
 * Implements the search bar functionality by adding an event listener to the search input element.
 * The search results are dynamically filtered based on the user's input.
 */
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

/**
 * Initializes the selected courses list by retrieving the selected courses data from the database
 * and adding them to the selected courses list.
 *
 * @returns {Promise<void>} A promise that resolves after initializing the selected courses list.
 */
async function initializeSelectedCoursesList() {
    const selectedCoursesData = await getAllObjectStoreData('selected');
    selectedCoursesData.forEach(selectedCourse => {
        const name = selectedCourse.name;
        const listCourse = findListCourse(name);
        addSelectedCourse(listCourse);
    })
}

/**
 * Finds a list course with the specified name in the search list.
 *
 * @param {string} name - The name of the course to find.
 * @returns {Object|null} The found list course object, or null if not found.
 */
function findListCourse(name) {
    const foundCourse = searchList.find(listCourse => listCourse.name === name);
    if (foundCourse) {
      return foundCourse;
    }
    return null; // Return null if the course is not found
}