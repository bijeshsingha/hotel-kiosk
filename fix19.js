const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/components/GuestDetailModal.tsx';
let content = fs.readFileSync(path, 'utf8');

const testWebhookState = `
  const [testingWebhook, setTestingWebhook] = useState(false);

  const handleTestWebhook = async (event: string) => {
    setTestingWebhook(true);
    try {
      const res = await fetch('/api/webhooks/pms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-pms-webhook-secret': 'test-secret'
        },
        body: JSON.stringify({ event, registrationId })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Webhook Success: ' + data.message + '\\nRefresh the page to see the anonymized/deleted record.');
      } else {
        alert('Webhook Failed: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      alert('Error triggering webhook');
    } finally {
      setTestingWebhook(false);
    }
  };
`;

content = content.replace(
  '  const [savingCheckout, setSavingCheckout] = useState(false);',
  '  const [savingCheckout, setSavingCheckout] = useState(false);' + testWebhookState
);

const testWebhookJSX = `
          {/* Webhook Testing Tools (Development Only) */}
          <div className="no-print bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-bold font-heading text-purple-900 mb-2">Developer Tools: Test PMS Webhooks</h3>
            <p className="text-xs text-purple-800 mb-3">Simulate incoming PMS webhooks to test the Compliance & PII Purging Engine without needing the actual PMS connected.</p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => handleTestWebhook('reservation.checked_out')} disabled={testingWebhook} className="bg-white text-purple-700 border-purple-300 hover:bg-purple-100">
                Simulate "Checked Out" (Anonymize)
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleTestWebhook('reservation.cancelled')} disabled={testingWebhook} className="bg-white text-red-700 border-red-300 hover:bg-red-50">
                Simulate "Cancelled" (Full Purge)
              </Button>
            </div>
          </div>

          {/* Government ID Image (no-print) */}`;

content = content.replace(
  '          {/* Government ID Image (no-print) */}',
  testWebhookJSX
);

fs.writeFileSync(path, content, 'utf8');
console.log('Added testing tools');
