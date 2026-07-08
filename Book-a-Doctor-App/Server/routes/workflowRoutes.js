const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllDoctorsControllers,
  docController,
  appointmentController,
  getAllUserAppointments,
  cancelUserAppointmentController
} = require('../controllers/userController');
const {
  getAllDoctorAppointmentsController,
  handleStatusController,
  completeConsultationController
} = require('../controllers/doctorController');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.get('/doctors', authMiddleware, getAllDoctorsControllers);
router.post('/doctors/apply', authMiddleware, docController);

router.post(
  '/appointments',
  authMiddleware,
  upload.fields([{ name: 'document', maxCount: 1 }, { name: 'image', maxCount: 1 }]),
  appointmentController
);
router.get('/appointments/patient', authMiddleware, getAllUserAppointments);
router.put('/appointments/:id/cancel', authMiddleware, cancelUserAppointmentController);
router.get('/appointments/doctor', authMiddleware, getAllDoctorAppointmentsController);
router.put('/appointments/:id/status', authMiddleware, handleStatusController);
router.put('/appointments/:id/consultation', authMiddleware, completeConsultationController);

module.exports = router;
