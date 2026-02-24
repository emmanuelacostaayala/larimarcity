const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

function extractText() {
    try {
        const filePath = path.resolve('../ESPAÑOL_EUROS_CONTRATO_OPCION_COMPRA_LARIMAR_PXX_APXXXX.docx');
        const content = fs.readFileSync(filePath, 'binary');
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        const text = doc.getFullText();
        fs.writeFileSync('extracted_text.txt', text, 'utf-8');
        console.log("Extracted text saved to extracted_text.txt");
    } catch (e) {
        console.error(e);
    }
}

extractText();
