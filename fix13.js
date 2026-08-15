const fs = require('fs');
const path = 'd:/kachra/Downloads/Digital Form Hotel/components/GuestRegistrationForm.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'import SignatureSection from \'./SignatureSection\';',
  'import SignatureSection from \'./SignatureSection\';\nimport IdUploadSection from \'./IdUploadSection\';'
);

content = content.replace(
  '      termsAccepted: true,\n      signatureDataUrl: \'\',',
  '      termsAccepted: true,\n      signatureDataUrl: \'\',\n      idImageUrl: \'\','
);

content = content.replace(
  '      termsAccepted: true,\n      signatureDataUrl: \'\',\n    });',
  '      termsAccepted: true,\n      signatureDataUrl: \'\',\n      idImageUrl: \'\',\n    });'
);

const idUploadJSX = `
      {/* ID Upload Section */}
      <IdUploadSection 
        onImageCaptured={(base64) => setValue('idImageUrl', base64 || '', { shouldValidate: true })} 
        error={errors.idImageUrl?.message}
      />

      {/* Signature & Terms Section */}`;

content = content.replace(
  '      {/* Signature & Terms Section */}',
  idUploadJSX
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done form');
