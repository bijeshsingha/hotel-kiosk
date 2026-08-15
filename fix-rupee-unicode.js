const fs = require('fs');
const RUPEE = '\u20B9'; // Unicode for Rupee symbol

function fixRupee(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // FloatingCart.tsx fixes
    content = content.split('?{item.price}').join(`${RUPEE}{item.price}`);
    content = content.split('?{totalPrice}').join(`${RUPEE}{totalPrice}`);
    content = content.split('(?{totalPrice})').join(`(${RUPEE}{totalPrice})`);
    
    // MenuItemCard.tsx fixes
    content = content.split('?{item.price}').join(`${RUPEE}{item.price}`);
    
    // API route fixes
    content = content.split('?${amount * quantity}').join(`${RUPEE}${'$'}{amount * quantity}`);
    content = content.split('?${totalPrice}').join(`${RUPEE}${'$'}{totalPrice}`);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Fixed " + filePath);
  }
}

fixRupee('components/menu/FloatingCart.tsx');
fixRupee('components/menu/MenuItemCard.tsx');
fixRupee('app/api/guest/order/route.ts');
fixRupee('app/api/sync/folio/route.ts');
