const path = require('path');

// Where the logged-in session is stored (Chapter 10: storageState)
exports.AUTH_FILE = path.join(__dirname, '..', '.auth', 'user.json');
