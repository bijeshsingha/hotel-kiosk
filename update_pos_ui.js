const fs = require('fs');
const file = 'app/pos/page.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/'\/api\/pos\/charge'/g, "'/api/sync/folio'");
  fs.writeFileSync(file, content, 'utf8');
}
