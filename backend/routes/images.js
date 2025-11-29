const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/albums/:filename(*)', (req, res) => { 
  try {
    let filename = req.params.filename;
    console.log('Requested image path:', filename);
    
    filename = decodeURIComponent(filename);
    console.log('Decoded filename:', filename);
    
    const actualFilename = filename.split('/').pop();
    console.log('Actual filename:', actualFilename);
    
    if (actualFilename.includes('..')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const possiblePaths = [
      path.join(__dirname, '../../images/albums', actualFilename),
      path.join(__dirname, '../../images/albums', filename), 
      path.join(process.cwd(), 'images', 'albums', actualFilename),
    ];

    let imagePath = null;
    for (const possiblePath of possiblePaths) {
      console.log('Checking path:', possiblePath);
      if (fs.existsSync(possiblePath)) {
        imagePath = possiblePath;
        console.log('Found image at:', imagePath);
        break;
      }
    }

    if (!imagePath) {
      console.log('Image not found in any location');
      return res.status(404).json({ error: 'Image not found: ' + actualFilename });
    }

    const ext = path.extname(actualFilename).toLowerCase();
    let contentType = 'image/jpeg';
    
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';

    console.log('Serving image with content type:', contentType);
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Internal server error serving image' });
  }
});

module.exports = router;