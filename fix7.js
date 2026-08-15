const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/components/GuestDetailModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add states
content = content.replace(
  'const [savingRoom, setSavingRoom] = useState(false);',
  `const [savingRoom, setSavingRoom] = useState(false);
  const [checkoutTime, setCheckoutTime] = useState(record.checkoutTime || '');
  const [extraItems, setExtraItems] = useState(record.extraItems || '');
  const [savingCheckout, setSavingCheckout] = useState(false);`
);

// Add icons
content = content.replace(
  'Check,',
  'Check,\n  Clock,\n  FileText,'
);

// Add save handler
const handleSaveCheckout = `
  const handleSaveCheckoutInfo = async () => {
    setSavingCheckout(true);
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateCheckout', registrationId, checkoutTime, extraItems }),
      });
      if (!res.ok) throw new Error('Failed to save checkout info');
      // optional success handling
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCheckout(false);
    }
  };

  return (`

content = content.replace(
  'return (',
  handleSaveCheckout
);

const checkoutUI = `          {/* Checkout & Billing Notes (no-print) */}
          <div className="no-print bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2.5 text-blue-900 border-b border-blue-200 pb-2">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-xs uppercase tracking-wider block">Checkout & Billing Notes</span>
                <span className="text-xs text-blue-800 font-body">Log checkout time and extra items consumed during stay.</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-1">
              <div className="flex flex-col gap-1 sm:w-1/3">
                <label className="text-xs font-bold text-blue-900 uppercase">Checkout Time</label>
                <input
                  type="datetime-local"
                  value={checkoutTime}
                  onChange={(e) => setCheckoutTime(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium border border-blue-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
              <div className="flex flex-col gap-1 sm:w-2/3">
                <label className="text-xs font-bold text-blue-900 uppercase">Extra Items Ordered</label>
                <textarea
                  value={extraItems}
                  onChange={(e) => setExtraItems(e.target.value)}
                  placeholder="e.g., 2 Coffees, 1 Water Bottle, Extra Bed"
                  className="px-3 py-1.5 text-xs font-medium border border-blue-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full resize-y min-h-[38px]"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end mt-1">
              <Button type="button" variant="primary" size="sm" onClick={handleSaveCheckoutInfo} disabled={savingCheckout} className="bg-blue-600 hover:bg-blue-700">
                <Check className="w-3.5 h-3.5 mr-1" /> {savingCheckout ? 'Saving...' : 'Save Checkout Info'}
              </Button>
            </div>
          </div>

          {/* Official Printable Header */}`;

content = content.replace(
  '          {/* Official Printable Header */}',
  checkoutUI
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done Modal');
