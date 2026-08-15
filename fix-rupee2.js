const fs = require('fs');

function fixRupee(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/\?\{item\.price\}/g, '?{item.price}');
    content = content.replace(/\?\{totalPrice\}/g, '?{totalPrice}');
    
    // For MenuItemCard.tsx specifically where I hardcoded "?{item.price}" in the script
    // No, it's just ?{item.price}
    
    // Let's also fix the string interpolation in api routes:
    // "?${amount * quantity}" -> "?${amount * quantity}"
    content = content.replace(/\?\$\{amount \* quantity\}/g, '?${amount * quantity}');
    
    // In guest order route:
    // "?${totalPrice}" -> "?${totalPrice}"
    content = content.replace(/\?\$\{totalPrice\}/g, '?${totalPrice}');
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

fixRupee('components/menu/FloatingCart.tsx');
fixRupee('components/menu/MenuItemCard.tsx');
fixRupee('app/api/guest/order/route.ts');
fixRupee('app/api/sync/folio/route.ts');
