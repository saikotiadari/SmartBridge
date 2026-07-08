const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const {
  getAllUsersControllers,
  getAllDoctorsControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController,
  getPendingDoctorsController,
  getOverviewController,
  checkAdminController
} = require('../controllers/adminController');

const router = express.Router();

router.get('/getallusers', authMiddleware, requireAdmin, getAllUsersControllers);
router.get('/getalldoctors', authMiddleware, requireAdmin, getAllDoctorsControllers);
router.post('/getapprove', authMiddleware, requireAdmin, getStatusApproveController);
router.post('/getreject', authMiddleware, requireAdmin, getStatusRejectController);
router.get('/getallappointments', authMiddleware, requireAdmin, displayAllAppointmentController);
router.get('/pending-doctors', authMiddleware, requireAdmin, getPendingDoctorsController);
router.get('/overview', authMiddleware, requireAdmin, getOverviewController);
router.put('/approve-doctor/:id', authMiddleware, requireAdmin, getStatusApproveController);
router.put('/reject-doctor/:id', authMiddleware, requireAdmin, getStatusRejectController);
router.get('/users', authMiddleware, requireAdmin, getAllUsersControllers);
router.get('/doctors', authMiddleware, requireAdmin, getAllDoctorsControllers);
router.get('/check-admin', checkAdminController);

module.exports = router;
