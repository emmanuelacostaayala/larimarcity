const fs = require('fs');
const filePath = 'prisma/schema.prisma';
let content = fs.readFileSync(filePath, 'utf8');

// Replace Unsupported types with compatible PostgreSQL types
content = content.replace(/Unsupported\("bool"\)/g, 'Boolean');
content = content.replace(/Unsupported\("integer unsigned"\)/g, 'Int');
content = content.replace(/Unsupported\("smallint unsigned"\)/g, 'Int');

// Remove ALL map: "..." labels from attributes to let Prisma/Postgres generate standard names
content = content.replace(/map: ".*?"/g, '');

// Clean up trailing commas inside attributes if any were left by the regex above
content = content.replace(/,\s*\)/g, ')');
content = content.replace(/\(\s*,/g, '(');

fs.writeFileSync(filePath, content);
console.log('Cleaned up schema.prisma');
