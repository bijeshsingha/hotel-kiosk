const fs = require('fs');

function fixRupee(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/\?/g, '?');
    // careful, there might be actual question marks? 
    // In FloatingCart.tsx: "?{item.price}", "?{totalPrice}"
    content = content.replace(/\?\{item\.price\}/g, '?{item.price}');
    content = content.replace(/\?\{totalPrice\}/g, '?{totalPrice}');
    
    // In GuestOrder route (app/api/guest/order/route.ts)
    content = content.replace(/\?(\$\{)/g, '?$1');
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

fixRupee('components/menu/FloatingCart.tsx');
fixRupee('components/menu/MenuItemCard.tsx');
fixRupee('app/api/guest/order/route.ts');
fixRupee('app/api/sync/folio/route.ts');
