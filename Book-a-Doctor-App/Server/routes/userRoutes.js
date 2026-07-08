const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const {
  registerController,
  registerDoctorController,
  loginController,
  doctorLoginController,
  authController,
  updateProfileController,
  docController,
  getallnotificationController,
  deleteallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
  cancelUserAppointmentController
} = require('../controllers/userController');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/register', registerController);
router.post('/register-doctor', registerDoctorController);
router.post('/login', loginController);
router.post('/doctor-login', doctorLoginController);
router.post('/getuserdata', authMiddleware, authController);
router.put('/updateprofile', authMiddleware, updateProfileController);
router.post('/registerdoc', authMiddleware, docController);
router.get('/getalldoctorsu', getAllDoctorsControllers);
router.post('/getappointment', authMiddleware, upload.single('image'), appointmentController);
router.post('/getallnotification', authMiddleware, getallnotificationController);
router.post('/deleteallnotification', authMiddleware, deleteallnotificationController);
router.get('/getuserappointments', authMiddleware, getAllUserAppointments);
router.put('/cancelappointment/:id', authMiddleware, cancelUserAppointmentController);
router.get('/getDocsforuser', authMiddleware, getDocsController);

module.exports = router;
