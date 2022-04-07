// create variable to hold DB connection
let db;

// establish a connection to IndexedDB database called "budget"
const request = indexedDB.open("budget", 1);

// this event will emit if the database version changes
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    // create object store called "pending" and set autoIncrement to true
    db.createObjectStore("pending", { autoIncrement: true });
};

// upon a successful request
request.onsuccess = function(event) {
    db = event.target.result;

    // check if app is online before reading from DB
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log("Error: " + event.target.errorCode);
};
