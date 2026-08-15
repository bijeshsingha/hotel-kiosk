const fs = require('fs');

function fixRupee(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.split('?{item.price}').join('?{item.price}');
    content = content.split('?{totalPrice}').join('?{totalPrice}');
    content = content.split('(?{totalPrice})').join('(?{totalPrice})');
    
    content = content.split('?${amount * quantity}').join('?${amount * quantity}');
    content = content.split('?${totalPrice}').join('?${totalPrice}');
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

fixRupee('components/menu/FloatingCart.tsx');
fixRupee('components/menu/MenuItemCard.tsx');
fixRupee('app/api/guest/order/route.ts');
fixRupee('app/api/sync/folio/route.ts');
