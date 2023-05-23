// shared.js
let db; // Declare a global variable to hold the IndexedDB connection

async function connectToDatabase() {
    return new Promise((resolve, reject) => {
        // const deletion = indexedDB.deleteDatabase('myDatabase');

        // deletion.onerror = async function(event) {
        //     console.error('Failed to delete database:', event.target.errorCode);
        // };

        // deletion.onsuccess = async function(event) {
        //     console.log('Database deleted successfully.');
        // };

        const request = indexedDB.open('myDatabase', 1);

        request.onerror = async (event) => {
            console.log('Database error:', event.target.error);
            reject(new Error('Failed to open database'));
        };

        request.onupgradeneeded = async (event) => {
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
            resolve();
        };

        request.onsuccess = async (event) => {
            db = event.target.result;
            console.log('Connected to database');
            resolve();
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