const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');

exports.getAllUsersControllers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

exports.getAllDoctorsControllers = async (req, res, next) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    next(error);
  }
};

exports.getStatusApproveController = async (req, res, next) => {
  try {
    const doctorId = req.params.id || req.body.doctorId;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, { status: 'Active' }, { new: true });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    await User.findByIdAndUpdate(doctor.userId, {
      isdoctor: true,
      $push: { notification: { type: 'doctor-approved', message: 'Your doctor application was approved' } }
    });

    res.status(200).json({ success: true, message: 'Doctor approved', doctor });
  } catch (error) {
    next(error);
  }
};

exports.getStatusRejectController = async (req, res, next) => {
  try {
    const doctorId = req.params.id || req.body.doctorId;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, { status: 'Rejected' }, { new: true });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    await User.findByIdAndUpdate(doctor.userId, {
      isdoctor: false,
      $push: { notification: { type: 'doctor-rejected', message: 'Your doctor application was rejected' } }
    });

    res.status(200).json({ success: true, message: 'Doctor rejected', doctor });
  } catch (error) {
    next(error);
  }
};

exports.displayAllAppointmentController = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().populate('doctorInfo').populate('userInfo');
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
};

exports.getPendingDoctorsController = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ status: 'Pending Approval' });
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    next(error);
  }
};

exports.getOverviewController = async (req, res, next) => {
  try {
    const [usersCount, doctorsCount, activeDoctorsCount, appointmentsCount] = await Promise.all([
      User.countDocuments({ type: 'user' }),
      Doctor.countDocuments(),
      Doctor.countDocuments({ status: 'Active' }),
      Appointment.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      overview: { usersCount, doctorsCount, activeDoctorsCount, appointmentsCount }
    });
  } catch (error) {
    next(error);
  }
};

exports.checkAdminController = async (req, res, next) => {
  try {
    const exists = await User.exists({ type: 'admin' });
    res.status(200).json({ success: true, exists: Boolean(exists) });
  } catch (error) {
    next(error);
  }
};
