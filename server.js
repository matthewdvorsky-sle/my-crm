const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'contacts.json');

app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Initialize contacts file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

// Get all contacts
app.get('/api/contacts', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch(e) {
    res.json([]);
  }
});

// Save all contacts (bulk)
app.post('/api/contacts', (req, res) => {
  try {
    const contacts = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(contacts));
    res.json({ success: true, count: contacts.length });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`CRM server running on port ${PORT}`);
});
