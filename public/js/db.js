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

function saveRecord(record) {
    // create a transaction on the pending DB with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");

    // access the object store
    const store = transaction.objectStore("pending");

    // add record to store with add method
    store.add(record);
}

function checkDatabase() {
    // open a transaction on your db
    const transaction = db.transaction(["pending"], "readwrite");
    // access your object store
    const store = transaction.objectStore("pending");
    // get all records from store and set to a variable
    const getAll = store.getAll();

    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if(getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                // if successful, open a transaction on your pending DB
                const transaction = db.transaction(["pending"], "readwrite");

                // access your pending object store
                const store = transaction.objectStore("pending");

                // clear all items in your store
                store.clear();
            });
        }
    };
}

// Listen for App coming back online
window.addEventListener("online", checkDatabase);