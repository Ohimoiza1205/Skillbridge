const mime = require('mime-types');

const path = '/Users/jaredalonzo/Downloads/resume.docx';

const mimeType = mime.lookup(path);

if (mimeType) {
  console.log(`Detected MIME type: ${mimeType}`);
} else {
  console.log(`Could not detect MIME type for: ${path}`);
}
