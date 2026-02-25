const fs = require('fs');
const c = fs.readFileSync('src/utils/docxGenerator.ts', 'utf8');
const idx = c.indexOf("c.type === 'Fisica' ? c.name");
if (idx === -1) {
    console.log('NOT FOUND');
} else {
    // Print 400 chars from that point to see the closing pattern
    console.log(JSON.stringify(c.substring(idx, idx + 400)));
}
