// create variable to hold DB connection
let db;

// establish a connection to IndexedDB database called "budget"
const request = indexedDB.open("budget", 1);
