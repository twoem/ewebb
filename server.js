const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const { removeOldFiles } = require('./utils/fileHandler');

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'ewebb_secret', resave: false, saveUninitialized: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Clean expired eulogy files on each visit
app.use((req, res, next) => {
  removeOldFiles(path.join(__dirname, 'public/uploads/eulogy'));
  next();
});

const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(publicRoutes);
app.use(adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
