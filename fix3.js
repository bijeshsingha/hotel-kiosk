const fs = require('fs');
const p = 'app/admin/page.tsx';
let content = fs.readFileSync(p, 'utf8');

content = content.replace(
`  Eye,
  PieChart,
  Key,
} from 'lucide-react';`,
`  Eye,
  PieChart,
  Key,
  UtensilsCrossed,
} from 'lucide-react';
import Link from 'next/link';`
);

content = content.replace(
`          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <Button type="button" variant="outline" size="sm" onClick={handleExportCSV} className="bg-white">
              <Download className="w-4 h-4 mr-1.5 text-gray-700" /> Export CSV
            </Button>`,
`          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <Link href="/pos">
              <Button type="button" variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-none">
                <UtensilsCrossed className="w-4 h-4 mr-1.5" /> Open F&B POS
              </Button>
            </Link>

            <Button type="button" variant="outline" size="sm" onClick={handleExportCSV} className="bg-white">
              <Download className="w-4 h-4 mr-1.5 text-gray-700" /> Export CSV
            </Button>`
);

fs.writeFileSync(p, content, 'utf8');
