// generate_qr.js
// Usage: node generate_qr.js "Text to encode"
// Produces: qr.png in the current folder

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const text = process.argv[2] || 'Welcome to PlateMate';
const out = path.join(__dirname, 'qr.png');

QRCode.toFile(out, text, { type: 'png', width: 400 }, function (err) {
  if (err) return console.error('Error generating QR:', err);
  console.log('QR generated:', out);
});