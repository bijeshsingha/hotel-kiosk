const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/components/GuestDetailModal.tsx';
let content = fs.readFileSync(path, 'utf8');

const idImageJSX = `
          {/* Official Printable Header */}`;

const newJSX = `
          {/* Government ID Image (no-print) */}
          {record.idImageUrl && (
            <div className="no-print bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
              <h3 className="text-sm font-bold font-heading text-gray-900 mb-2">Government ID</h3>
              <img src={record.idImageUrl} alt="Government ID" className="max-h-[300px] rounded border border-gray-300 bg-white object-contain" />
            </div>
          )}

          {/* Official Printable Header */}`;

content = content.replace(idImageJSX, newJSX);

fs.writeFileSync(path, content, 'utf8');
console.log('Done modal display');
