const express = require('express');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
  completeConsultationController
} = require('../controllers/doctorController');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/updateprofile', authMiddleware, updateDoctorProfileController);
router.get('/getdoctorappointments', authMiddleware, getAllDoctorAppointmentsController);
router.post('/handlestatus', authMiddleware, handleStatusController);
router.put('/appointments/:id/status', authMiddleware, handleStatusController);
router.put('/appointments/:id/consultation', authMiddleware, completeConsultationController);
router.get('/getdocumentdownload', authMiddleware, documentDownloadController);

module.exports = router;
