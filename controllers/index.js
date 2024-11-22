const router = require('express').Router();
const userRoutes = require('./api/userRoutes.js');
const postRoutes = require('./api/postRoutes.js');

// const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

router.use('/users', userRoutes);
router.use('/', homeRoutes);
router.use('/posts', postRoutes);

module.exports = router;
