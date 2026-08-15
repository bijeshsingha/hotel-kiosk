import { MenuLayout } from '@/components/menu/MenuLayout';
import fs from 'fs';
import path from 'path';

export default async function MenuPage() {
  // Read static JSON data generated from Excel
  const jsonPath = path.join(process.cwd(), 'data', 'menu.json');
  let menuData = {};
  
  try {
    const fileContents = fs.readFileSync(jsonPath, 'utf8');
    menuData = JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading menu JSON:', error);
    // Fallback empty state
    menuData = { "No Menu Data": [] };
  }

  return <MenuLayout menuData={menuData} />;
}
