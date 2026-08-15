const fs = require('fs');
const file = 'app/check-in/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="inline-flex flex-col items-center mt-6">[\s\S]*?<\/div>\s*<\/header>/;

content = content.replace(regex, '</header>');
fs.writeFileSync(file, content, 'utf8');
