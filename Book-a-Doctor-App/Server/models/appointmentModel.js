const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    doctorInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    userInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String
    },
    document: {
      type: String
    },
    status: {
      type: String,
      enum: ['Under Review', 'Scheduled', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Under Review'
    },
    clinicalNotes: {
      type: String,
      trim: true,
      default: ''
    },
    diagnosis: {
      type: String,
      trim: true,
      default: ''
    },
    digitalPrescription: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
