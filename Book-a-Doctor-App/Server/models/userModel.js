const mongoose = require('mongoose');

const capitalizeName = (value) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      set: capitalizeName
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['user', 'admin', 'doctor'],
      default: 'user'
    },
    isdoctor: {
      type: Boolean,
      default: false
    },
    notification: [{ type: Object }],
    seennotification: [{ type: Object }],
    documents: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
