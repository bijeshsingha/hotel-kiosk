const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/app/admin/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'RefreshCw,',
  'RefreshCw,\n  Download,'
);

const exportFunc = `  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert("No data to export");
      return;
    }
    const headers = ["Registration ID", "Date", "Time", "Full Name", "Mobile", "Nationality", "Room Number", "Status", "Total Co-Guests"];
    const rows = registrations.map(reg => {
      const g = reg.primaryGuest || { contact: {} };
      const d = new Date(reg.createdAt);
      return [
        reg.registrationId,
        d.toLocaleDateString(),
        d.toLocaleTimeString(),
        \`"\${g.fullName || ''}"\`,
        g.contact?.mobileNumber || '',
        g.nationality || '',
        reg.roomNumber || '',
        reg.syncStatus || '',
        reg.coGuests ? reg.coGuests.length : 0
      ].join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", \`hotel_guests_export_\${new Date().toISOString().split('T')[0]}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getChannelBadgeColor`;

content = content.replace(
  '  const getChannelBadgeColor',
  exportFunc
);

const buttonUI = `<div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <Button type="button" variant="outline" size="sm" onClick={handleExportCSV} className="bg-white">
            <Download className="w-4 h-4 mr-1.5 text-gray-700" /> Export CSV
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={fetchRegistrations}`;

content = content.replace(
  /<div className="flex items-center gap-3 w-full sm:w-auto">\s*<Button type="button" variant="outline" size="sm" onClick=\{fetchRegistrations\}/g,
  buttonUI
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done');
