'use strict'

var sqlite = require('sqlite3').verbose();

const DBSOURCE = './db/CookIT_Database.db';

const db = new sqlite.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
});

module.exports = db;
