const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const dirPath = "c:/Users/enman/.gemini/antigravity/scratch/larimarcity";

function extractExcel(filename) {
    try {
        const filePath = path.join(dirPath, filename);
        const workbook = xlsx.readFile(filePath);

        console.log(`\n\n=== EXCEL FILE: ${filename} ===\n`);

        workbook.SheetNames.forEach(sheetName => {
            console.log(`\n--- Sheet: ${sheetName} ---`);
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

            // Print first 5 rows to understand structure
            for (let i = 0; i < Math.min(5, data.length); i++) {
                console.log(`Row ${i + 1}:`, data[i]);
            }
            console.log(`... (${data.length} total rows)`);
        });
    } catch (e) {
        console.error(`Error reading ${filename}:`, e.message);
    }
}

extractExcel("DATOS_NEGOCIO_PLANTILLA_V4.xlsm");
extractExcel("Solicitud Fianza Alliance  Seguros (Base.xls");
extractExcel("Listado_disponibilidad_CRM_25_02_2026.xlsx");
