const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

const queueNotificationEngineAlert = async (user, type, message) => {
  user.notification.push({
    type,
    message,
    channels: ['email', 'sms', 'in-app'],
    deliveryStatus: 'queued'
  });
  await user.save();
};

exports.updateDoctorProfileController = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOneAndUpdate({ userId: req.body.userId }, req.body, { new: true });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({ success: true, message: 'Profile updated', doctor });
  } catch (error) {
    next(error);
  }
};

exports.getAllDoctorAppointmentsController = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId || req.body.userId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const appointments = await Appointment.find({ doctorInfo: doctor._id }).populate('userInfo');
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
};

exports.handleStatusController = async (req, res, next) => {
  try {
    const appointId = req.params.id || req.body.appointId;
    const { status } = req.body;
    const allowedStatuses = ['Scheduled', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status transition' });
    }

    const doctor = await Doctor.findOne({ userId: req.userId || req.body.userId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointId, doctorInfo: doctor._id, status: 'Under Review' },
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const user = await User.findById(appointment.userInfo);
    if (user) {
      const message = status === 'Scheduled'
        ? 'Your appointment has been scheduled by the doctor.'
        : 'Your appointment request was rejected by the doctor.';

      await queueNotificationEngineAlert(user, 'appointment-status', message);
    }

    res.status(200).json({ success: true, message: 'Appointment status updated', appointment });
  } catch (error) {
    next(error);
  }
};

exports.completeConsultationController = async (req, res, next) => {
  try {
    const { clinicalNotes, diagnosis, digitalPrescription } = req.body;
    const doctor = await Doctor.findOne({ userId: req.userId || req.body.userId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctorInfo: doctor._id, status: 'Scheduled' },
      { status: 'Completed', clinicalNotes, diagnosis, digitalPrescription },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found or not ready for completion' });
    }

    const user = await User.findById(appointment.userInfo);
    if (user) {
      await queueNotificationEngineAlert(
        user,
        'consultation-completed',
        'Your consultation has been completed. Visit summary is available.'
      );
    }

    res.status(200).json({ success: true, message: 'Consultation details saved', appointment });
  } catch (error) {
    next(error);
  }
};

exports.documentDownloadController = async (req, res, next) => {
  try {
    const { appointId } = req.query;
    const appointment = await Appointment.findById(appointId);

    if (!appointment || !appointment.document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const filePath = path.resolve(appointment.document);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    res.download(filePath);
  } catch (error) {
    next(error);
  }
};
