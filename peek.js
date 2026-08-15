const xlsx = require('xlsx');
const workbook = xlsx.readFile('FoodMenu.xlsx');
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
console.log(data.slice(0, 5));
