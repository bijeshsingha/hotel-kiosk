const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_PATH = path.join(__dirname, '../FoodMenu.xlsx');
const JSON_PATH = path.join(__dirname, '../data/menu.json');

try {
  const workbook = xlsx.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Group by category
  const menuByCategory = {};

  rawData.forEach((row, index) => {
    const category = row.Category || 'Uncategorized';
    
    if (!menuByCategory[category]) {
      menuByCategory[category] = [];
    }

    menuByCategory[category].push({
      id: `item-${index}`,
      name: row.Item_Name,
      price: parseInt(row.Price_INR) || 0,
      dietary: row.Dietary_Type || 'Veg',
      time: row.Availability_Time || ''
    });
  });

  fs.writeFileSync(JSON_PATH, JSON.stringify(menuByCategory, null, 2));
  console.log(`Successfully converted ${rawData.length} items into data/menu.json!`);

} catch (err) {
  console.error("Error converting menu:", err);
}
