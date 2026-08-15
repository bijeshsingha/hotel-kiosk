const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/app/admin/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /<\/div>\s*<\/div>\s*\{selectedRecord/g,
  '</div>\n\n      {/* Guest Full Detail & Print Modal */}\n      {selectedRecord'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done');
