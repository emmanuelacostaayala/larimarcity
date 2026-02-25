const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const dirPath = "c:/Users/enman/.gemini/antigravity/scratch/larimarcity";

function extractWord(filename) {
    try {
        const filePath = path.join(dirPath, filename);
        const zip = new AdmZip(filePath);

        // The main text content in a DOCX file is stored in word/document.xml
        const documentXml = zip.readAsText('word/document.xml');

        // Quick regex to strip XML tags and just print text, and specifically look for links or highlights
        const cleanText = documentXml.replace(/<w:p[^>]*>/g, '\n').replace(/<[^>]+>/g, '');

        console.log(`\n\n=== WORD FILE: ${filename} ===\n`);
        // Print in chunks to see variables mapping
        console.log(cleanText.substring(0, 3000));
        console.log("...\n[End of snippet]\n");

    } catch (e) {
        console.error(`Error reading ${filename}:`, e.message);
    }
}

const wordFiles = [
    "ESPAÑOL_EUROS_CONTRATO_OPCION_COMPRA_LARIMAR_PXX_APXXXX.docx",
    "ESPAÑOL_€_CONTRATO_OPCION_COMPRA_LARIMAR_THX_APXXXX.docx",
    "CONTRATO_ESP_OPCION_COMPRA_Sociedad.docx"
];

wordFiles.forEach(extractWord);
