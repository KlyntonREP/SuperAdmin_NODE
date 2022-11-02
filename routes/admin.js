const express = require('express');

const adminController = require('../controllers/admin');

router = express.Router();

router.post('/addAdmin', adminController.addAdmin);
router.post('/login', adminController.adminLogin);
router.post('/addTeacher', adminController.addTeacher);
router.post('/assignClass/:id', adminController.assignTeacher);
router.post('/unAssignClass/:id', adminController.unassignClass);
router.post('/blockTeacher/:id', adminController.blockTeacher);
router.post('/unblockTeacher/:id', adminController.unblockTeacher);
router.post('/removeTeacher/:id', adminController.removeTeacher);
router.get('/fetchTeachers', adminController.fetchTeachers);
router.get('/blockRequests', adminController.fetchBlockReq);
router.get('/unblockRequests', adminController.fetchUnblockReq);
router.post('/approveBlockRequest/:id', adminController.approveBlockReq);
router.post('/approveUnblockRequest/:id', adminController.approveUnblockReq);

module.exports = router;