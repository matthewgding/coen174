let selectedCoursesList = [];
let searchList = [];

async function isCoursesDataUploaded() {
    const objectStoreCourses = await getAllObjectStoreData('courses');
    return !(objectStoreCourses.length === 0);
}

async function csvFileToJSON(csvFile) {
    const response = await fetch(csvFile);
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

async function uploadCoursesData() {
    const csvFile = "../../misc/SCU_Find_Course_Sections_Fall_2023.csv"
    const coursesJSON = await csvFileToJSON(csvFile);

    const transaction = db.transaction('courses', 'readwrite');
    const objectStore = transaction.objectStore('courses');
  
    for (let i = 0; i < coursesJSON.length; ++i) {
      const course = coursesJSON[i];
      await updateCourseData(course, objectStore);
    }
}
  
async function updateCourseData(course, objectStore) {
    return new Promise((resolve, reject) => {
        const getRequest = objectStore.get(course.name);

        getRequest.onsuccess = async function(event) {
            const existingValue = event.target.result;
            if (existingValue) {
                let newSections = existingValue.sections;
                newSections.push(course);
                const newObject = {
                    name: course.name,
                    sections: newSections
                };
                const putObject = await objectStore.put(newObject, course.name);
                resolve();
            } else {
                const sections = [course];
                const newObject = {
                    name: course.name,
                    sections: sections
                };
                const putObject = await objectStore.put(newObject, course.name);
                resolve();
            }
        };

        getRequest.onerror = function(event) {
            console.error('Failed to retrieve existing data:', event.target.errorCode);
            reject(new Error('Failed to retrieve existing data'));
        };
    });
}

function getAllObjectStoreData(objectStoreName) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(objectStoreName, 'readonly');
      const objectStore = transaction.objectStore(objectStoreName);
      const getAllRequest = objectStore.getAll();
  
      getAllRequest.onsuccess = function(event) {
        const allData = event.target.result;
        console.log("All data retrieved:", allData);
        resolve(allData);
      };
  
      getAllRequest.onerror = function(event) {
        console.error('Failed to retrieve data:', event.target.errorCode);
        reject(new Error('Failed to retrieve data'));
      };
    });
}

// Courses is an array of objects in form of {name: __, sections: [...]}
async function populateSearchCourseList() {
    const objectStoreCourses = await getAllObjectStoreData('courses');
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
    console.log("coursedata", courseData);
    const transaction = db.transaction('selected', 'readwrite');
    const objectStore = transaction.objectStore('selected');
    await objectStore.put(courseData, courseData.name);
    console.log(await getAllObjectStoreData('selected'));
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
    console.log(await getAllObjectStoreData('selected'));
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
        console.log("name", name);
        const listCourse = findListCourse(name);
        console.log("found list course", listCourse);
        addSelectedCourse(listCourse);
    })
}

function findListCourse(name) {
    console.log("search list", searchList);
    const foundCourse = searchList.find(listCourse => listCourse.name === name);
    if (foundCourse) {
      console.log("FOUND");
      console.log("listcourse", foundCourse);
      return foundCourse;
    }
    return null; // Return null if the course is not found
  }

// Implementation
async function main() {
    await connectToDatabase();
    if (!(await isCoursesDataUploaded())) {
        console.log("populating courses");
        await uploadCoursesData();
    }
    implementSearchBar();
    await populateSearchCourseList();
    initializeSelectedCoursesList();
    console.log("closed");
}
main();