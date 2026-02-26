import { Database } from "bun:sqlite";
import fs from "fs";

const db = new Database("prisma/dev.db");

const tables = [
    "data_entry_proyecto",
    "data_entry_edificio",
    "data_entry_closer",
    "data_entry_broker",
    "data_entry_liner",
    "data_entry_propiedad",
    "data_entry_cliente",
    // auth_user might be needed as well
    "auth_user"
];

for (const table of tables) {
    console.log(`Exporting ${table}...`);
    try {
        const data = db.query(`SELECT * FROM ${table}`).all();
        fs.writeFileSync(`${table}_dump.json`, JSON.stringify(data, null, 2));
        console.log(`Exported ${data.length} records from ${table}.`);
    } catch (err) {
        console.warn(`Could not export ${table}:`, err.message);
    }
}

db.close();
