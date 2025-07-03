const mime = require('mime-types');
const path = '/Users/jaredalonzo/Downloads/resume.docx';

const mimeType = mime.lookup(path);

console.log(`Detected MIME type for ${path}: ${mimeType}`);
