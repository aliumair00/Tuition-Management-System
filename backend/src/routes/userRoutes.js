const express = require('express');
const {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const User = require('../models/User');
const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');
const advancedResults = require('../middlewares/advancedResults');
const upload = require('../middlewares/uploadMiddleware');

router.use(protect);
router.use(authorize('Admin'));

router
    .route('/')
    .get(advancedResults(User), getUsers)
    .post(upload.single('profileImage'), createUser);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
