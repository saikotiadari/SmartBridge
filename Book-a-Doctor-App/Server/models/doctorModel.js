const mongoose = require('mongoose');

const capitalizeName = (value) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    fullname: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      set: capitalizeName
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    timings: {
      type: String,
      trim: true
    },
    availability: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    specialisation: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending Approval', 'Active', 'Rejected'],
      default: 'Pending Approval'
    },
    experience: {
      type: Number,
      default: 0
    },
    fees: {
      type: Number,
      default: 0
    },
    about: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
