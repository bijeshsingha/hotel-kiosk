const fs = require('fs');

const file1 = 'components/GuestRegistrationForm.tsx';
if (fs.existsSync(file1)) {
  let content = fs.readFileSync(file1, 'utf8');
  content = content.replace(/'\/api\/pms-sync'/g, "'/api/sync/guest'");
  fs.writeFileSync(file1, content, 'utf8');
}

const file2 = 'components/FrontDeskDashboard.tsx';
if (fs.existsSync(file2)) {
  let content = fs.readFileSync(file2, 'utf8');
  content = content.replace(/'\/api\/pms-sync'/g, "'/api/sync/guest'");
  fs.writeFileSync(file2, content, 'utf8');
}
