const express = require('express')

const teacherController = require('../controllers/teacher')

router = express.Router();

router.post('/createStudent/:id', teacherController.createStudent);
router.post('/addStudentToClass/:id', teacherController.addStudentToClass);
router.post('/removeStudentFromClass/:id', teacherController.removeStudentFromClass);
router.post('/blockstudent/:id', teacherController.blockStudent);
router.post('/unblockstudent/:id', teacherController.unblockStudent);
router.get('/fetchStudent/:id', teacherController.fetchStudent);
router.post('/approvePost/:id/:postId', teacherController.approvePost);
router.post('/addTestScore/:teacherId/:studentId', teacherController.addTestScores);
router.post('/addExamScore/:teacherId/:studentId', teacherController.addExamScores);


module.exports = router