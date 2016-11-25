﻿var DB_NAME = "kamobile-v1.db";
var DB_ALIAS = "kamobile-v1.db";
var DB_VERSION = "2.0";
var DB_SIZE = 500 * 1024 * 1024;
var DB_SETTINGS_TBL = "settings";
var DB_USER_CONTEXTS_TBL = "userContexts";
var DB_JOURNAL_TBL = "journals";
var DB_JOURNAL_STOPPOINTS_TBL = "journalStopPoints";
var DB_JOURNAL_ACTIVITIES_TBL = "journalActivities";
var DB_JOURNAL_LOCATIONS_TBL = "journalLocations";

class LocalStorageDB implements IDatabaseAPI {
    private db: any;
    
    constructor() {
    }

    private createTable(tx, name, columns: Array<any>): void {
        let columnsSql = "";
        for (let i = 0; i < columns.length; i++) {  //{name: 'columnName', type: 'type', extra:'' }           
            let column = columns[i];
            if (i > 0) columnsSql += ", ";
            columnsSql += (column.name + " " + column.type + " " + column.extra);
        }
        let sql = "CREATE TABLE IF NOT EXISTS [" + name + "](" + columnsSql + ")";
        kapp.log.debug(sql);
        tx.executeSql(sql, [],
            function (tx) {
                kapp.log.debug("Create table " + name + " successfully");
            },
            function (tx, dberr) {
                kapp.log.error("Error while create table " + name + ": " + dberr.message);
            });
    }

    public initialize(callback: (result: IQueryResult) => any): void {
        kapp.log.debug("Initialize database");
        this.db = window.openDatabase(DB_NAME, DB_VERSION, DB_ALIAS, DB_SIZE);
        let api = this;
        this.db.transaction(function (tx) {
            kapp.log.debug("Check to create table: " + DB_SETTINGS_TBL);
            api.createTable(tx, DB_SETTINGS_TBL, [
                { name: "name", type: "text", extra: "PRIMARY KEY NOT NULL COLLATE NOCASE" },
                { name: "value", type: "text", extra: "" }
            ]);

            kapp.log.debug("Check to create table: " + DB_USER_CONTEXTS_TBL);
            api.createTable(tx, DB_USER_CONTEXTS_TBL, [
                { name: "userId", type: "int", extra: "PRIMARY KEY NOT NULL COLLATE NOCASE" },
                { name: "userName", type: "text", extra: "NOT NULL COLLATE NOCASE" },
                { name: "value", type: "text", extra: "NULL" }
            ]);

            kapp.log.debug("Check to create table: " + DB_JOURNAL_TBL);
            api.createTable(tx, DB_JOURNAL_TBL, [                
                { name: "id", type: "int", extra: "PRIMARY KEY NOT NULL COLLATE NOCASE" },                
                { name: "userId", type: "int", extra: "NOT NULL" },
                { name: "name", type: "text", extra: "NOT NULL" },
                { name: "description", type: "text", extra: "NULL" },
                { name: "startLocation", type: "text", extra: "NOT NULL" },
                { name: "startLat", type: "float", extra: "NOT NULL" },
                { name: "startLng", type: "float", extra: "NOT NULL" },
                { name: "endLocation", type: "text", extra: "NOT NULL" },
                { name: "endLat", type: "float", extra: "NOT NULL" },
                { name: "endLng", type: "int", extra: "NOT NULL" },
                { name: "activeDate", type: "text", extra: "NOT NULL" },
                { name: "status", type: "int", extra: "NOT NULL" },
                { name: "extendedData", type: "text", extra: "NULL" },
                { name: "createdTS", type: "text", extra: "NOT NULL" },
                { name: "lastUpdatedTS", type: "text", extra: "NOT NULL" }
            ]);

            kapp.log.debug("Check to create table: " + DB_JOURNAL_STOPPOINTS_TBL);
            api.createTable(tx, DB_JOURNAL_STOPPOINTS_TBL, [                
                { name: "id", type: "int", extra: "PRIMARY KEY NOT NULL COLLATE NOCASE" },            
                { name: "journalId", type: "int", extra: "NOT NULL" },
                { name: "mame", type: "text", extra: "NOT NULL" },
                { name: "description", type: "text", extra: "NOT NULL" },
                { name: "latitude", type: "float", extra: "NOT NULL" },
                { name: "longitude", type: "float", extra: "NOT NULL" },
                { name: "extendedData", type: "text", extra: "NULL" },
                { name: "createdTS", type: "text", extra: "NOT NULL" },
                { name: "lastUpdatedTS", type: "text", extra: "NOT NULL" }
            ]);

            kapp.log.debug("Check to create table: " + DB_JOURNAL_ACTIVITIES_TBL);
            api.createTable(tx, DB_JOURNAL_ACTIVITIES_TBL, [
                { name: "id", type: "int", extra: "PRIMARY KEY NOT NULL COLLATE NOCASE" },
                { name: "journalId", type: "int", extra: "NOT NULL" },
                { name: "UserId", type: "int", extra: "NOT NULL" },
                { name: "activityId", type: "int", extra: "NOT NULL" },
                { name: "activityDetail", type: "text", extra: "NULL" },
                { name: "extendedData", type: "text", extra: "NULL" },
                { name: "createdTS", type: "text", extra: "NOT NULL" },
                { name: "lastUpdatedTS", type: "text", extra: "NOT NULL" }
            ]);       

            kapp.log.debug("Check to create table: " + DB_JOURNAL_LOCATIONS_TBL);
            api.createTable(tx, DB_JOURNAL_LOCATIONS_TBL, [
                { name: "id", type: "int", extra: "PRIMARY KEY NOT NULL COLLATE NOCASE" },
                { name: "journalId", type: "int", extra: "NOT NULL" },
                { name: "UserId", type: "int", extra: "NOT NULL" },
                { name: "TruckId", type: "int", extra: "NULL" },
                { name: "latitude", type: "float", extra: "NOT NULL" },
                { name: "longitude", type: "float", extra: "NOT NULL" },
                { name: "accuracy", type: "float", extra: "NOT NULL" },
                { name: "stopCount", type: "int", extra: "NOT NULL" },
                { name: "status", type: "int", extra: "NULL" },
                { name: "createdTS", type: "text", extra: "NOT NULL" },
                { name: "lastUpdatedTS", type: "text", extra: "NOT NULL" }
            ]);

            setTimeout(function () { callback({ errorMessage: null }) }, 1000);

            //setTimeout(function () { callback(new QueryResult()); }, 1000);
        }, function (txerror) {
            kapp.log.error(txerror.errorMessage);
            callback({ errorMessage : "Cannot open db transation!"});
        });
    }

    public getSettings(callback: (result: IQueryResult) => any): void {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });

            //var errResult = new QueryResult();
            //errResult.errorMessage = "Database was not initialized";
            //callback(errResult);
            return;
        }

        let _this = this;
        this.db.transaction(function (tx) {
            let sql = "SELECT * FROM " + DB_SETTINGS_TBL;
            kapp.log.debug(sql);
            tx.executeSql(sql, [],
                function (tx, dbres) {
                    callback({ rows: dbres.rows, transaction : tx });

                    //let result = new QueryResult();
                    //result.rows = dbres.rows;
                    //result.dbtransaction = tx;
                    //callback(result);
                },
                function (tx, dberr) {
                    callback({ errorMessage: dberr.message, transaction: tx });

                    //let result = new QueryResult();
                    //result.errorObject = dberr;
                    //result.errorMessage = dberr.message;
                    //callback(result);
                });
        });
    }

    public saveSettings(settings: Array<any>, callback: (result: IQueryResult) => any): void {
        this.db.transaction(function (tx) {
            for (let i = 0; i < settings.length; i++) {
                let setting = settings[i];
                let sql = "INSERT OR REPLACE INTO " + DB_SETTINGS_TBL + " VALUES (";
                sql = sql.concat("'", setting.name, "', ");
                sql = sql.concat("'", setting.value, "')");
                kapp.log.debug(sql);
                tx.executeSql(sql, [], function () { }, function (tx, dberr) { kapp.log.debug(dberr.errorMessage); });
            }
            callback({ transaction: tx });
            //callback(new QueryResult());
        }, function (txerror) {
            kapp.log.error(txerror.errorMessage);
            callback({errorMessage: "Cannot open db transation!" });

            //var result = new QueryResult();
            //result.errorMessage = "Cannot open db transation!";
            //callback(result);
        });
    }

    public getUserContext(userId : number, callback: (result: IQueryResult) => any): void {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            return;
        }

        let _this = this;
        this.db.transaction(function (tx) {
            let sql = "SELECT * FROM " + DB_USER_CONTEXTS_TBL + " WHERE userId = " + userId.toString() + " LIMIT 1";
            kapp.log.debug(sql);
            tx.executeSql(sql, [],
                function (tx, dbres) {
                    callback({ rows: dbres.rows, transaction: tx });
                },
                function (tx, dberr) {
                    callback({ errorMessage: dberr.message, transaction: tx });
                });
        });
    }

    public saveUserContext(userId: number, userName: string, value: string, callback: (result: IQueryResult) => any): void {
        if (kapp.utils.isNull(this.db)) {
            callback({ errorMessage: "Database was not initialized" });
            return;
        }

        let _this = this;
        this.db.transaction(function (tx) {
            let sql = "SELECT * FROM " + DB_USER_CONTEXTS_TBL + " WHERE userId = " + userId.toString() + " LIMIT 1";
            kapp.log.debug(sql);
            tx.executeSql(sql, [],
                function (tx, dbres) {
                    let sql = "";
                    if (dbres.rows.length > 0) {
                        sql = "UPDATE " + DB_USER_CONTEXTS_TBL + " SET value = '" + value + "' WHERE userId = " + userId.toString();
                    } else {
                        sql = "INSERT INTO " + DB_USER_CONTEXTS_TBL + " VALUES (" +
                            userId.toString() + "," + // userId,
                            "'" + userName + "'," + // userId,
                            "'" + value + "'" +
                            ")"; // userId,
                    }
                    kapp.log.debug(sql);
                    tx.executeSql(sql, [],
                        function (tx, dbres) {
                            callback({ transaction: tx });
                        },
                        function (tx, dberr) {
                            callback({ errorMessage: dberr.message, transaction: tx });
                        });
                },
                function (tx, dberr) {
                    callback({ errorMessage: dberr.message, transaction: tx });
                });
        });
    }
}