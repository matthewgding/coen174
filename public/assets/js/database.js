let db; // Declare a global variable to hold the IndexedDB connection

/**
 * Connects to the indexedDB database 'myDatabase' and handles database creation.
 *
 * @returns {Promise<void>} A Promise that resolves when the connection to the database is established successfully.
 * @throws {Error} If there is an error opening or deleting the database.
 */
function connectToDatabase() {
    return new Promise((resolve, reject) => {

        // const deletion = indexedDB.deleteDatabase('myDatabase');

        // deletion.onerror = async function(event) {
        //     console.error('Failed to delete database:', event.target.errorCode);
        // };

        // deletion.onsuccess = async function(event) {
        //     console.log('Database deleted successfully.');
        // };
        const request = indexedDB.open('myDatabase', 1);

        request.onerror = (event) => {
            console.log('Database error:', event.target.error);
            reject(new Error('Failed to open database'));
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            // Check if the object store exists before deleting it
            if (db.objectStoreNames.contains('courses')) {
                db.deleteObjectStore('courses');
                console.log('Object store deleted successfully.');
            }
            if (db.objectStoreNames.contains('selected')) {
                db.deleteObjectStore('selected');
                console.log('Object store deleted successfully.');
            }
            const objectStoreCourses = db.createObjectStore('courses');
            const objectStoreSelected = db.createObjectStore('selected');

            console.log('Database and object store created');
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            db.onversionchange = () => {
                db.close(); // Close the connection when a version change occurs
            };
            console.log('Connected to database');
            resolve();
        };
    });
}

/**
 * Checks if the 'courses' object store in the database has any data.
 *
 * @returns {Promise<boolean>} A Promise that resolves to `true` if there is data in the 'courses' object store, `false` otherwise.
 * @throws {Error} If there is an error retrieving data from the 'courses' object store.
 */
async function isCoursesDataUploaded() {
    const objectStoreCourses = await getAllObjectStoreData('courses');
    return !(objectStoreCourses.length === 0);
}

/**
 * Retrieves all data from the specified object store.
 *
 * @param {string} objectStoreName - The name of the object store from which to retrieve data.
 * @returns {Promise<Array<Object>>} A Promise that resolves to an array of objects representing the retrieved data.
 * @throws {Error} If there is an error retrieving data from the object store.
 */
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

/**
 * Uploads courses data to the 'courses' object store in the database.
 *
 * @param {Array<Object>} coursesJSON - An array of course data objects in JSON format to be uploaded.
 * @returns {Promise<void>} A Promise that resolves when all course data has been uploaded successfully.
 */
async function uploadCoursesData(coursesJSON) {
    const transaction = db.transaction('courses', 'readwrite');
    const objectStore = transaction.objectStore('courses');
  
    for (let i = 0; i < coursesJSON.length; ++i) {
      const course = coursesJSON[i];
      await updateCourseData(course, objectStore);
    }
}
  
/**
 * Updates the data for a specific course in the specified object store.
 *
 * @param {Object} course - The course data object to be updated.
 * @param {IDBObjectStore} objectStore - The object store in which to update the data.
 * @returns {Promise<void>} A Promise that resolves when the course data has been updated successfully.
 * @throws {Error} If there is an error retrieving or updating the existing data.
 */
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

/**
 * Retrieves all sections of the selected courses from the 'selected' object store.
 *
 * @returns {Promise<Array<Array<Object>>>} A Promise that resolves to an array of arrays, where each inner array represents the sections of a selected course.
 * @throws {Error} If there is an error retrieving data from the 'selected' object store.
 */
async function getSelectedCoursesSections() {
    const selectedCoursesData = await getAllObjectStoreData('selected');
    let selectedCoursesSections = [];
    for (let i = 0; i < selectedCoursesData.length; ++i) {
        selectedCoursesSections.push(selectedCoursesData[i].sections);
    }
    return selectedCoursesSections;
}

