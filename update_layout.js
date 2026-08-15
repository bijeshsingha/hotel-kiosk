const fs = require('fs');
const file = 'app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Insert import if not exists
if (!content.includes('import { GlobalNav }')) {
  content = content.replace(
    "import './globals.css';",
    "import './globals.css';\nimport { GlobalNav } from '@/components/GlobalNav';"
  );
}

// Insert GlobalNav inside body
if (!content.includes('<GlobalNav />')) {
  content = content.replace(
    '{children}',
    '{children}\n        <GlobalNav />'
  );
}

fs.writeFileSync(file, content, 'utf8');
