const express = require('express')

const studentController = require('../controllers/student')

router = express.Router()

router.post('/login', studentController.studentLogin)
router.get('/fetchClassmates/:id', studentController.viewClassmates)
router.post('/complain/:id', studentController.complain)
router.post('/createPost/:id', studentController.createPost)
router.get('/Posts/:id', studentController.fetchPosts)

module.exports = router;