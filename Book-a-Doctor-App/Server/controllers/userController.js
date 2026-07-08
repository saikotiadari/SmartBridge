const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');

exports.registerController = async (req, res, next) => {
  try {
    const { name, email, password, phone, type } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const adminExists = await User.exists({ type: 'admin' });
    const requestedType = type === 'admin' ? 'admin' : 'user';

    if (requestedType === 'admin' && adminExists) {
      return res.status(403).json({ success: false, message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      type: requestedType,
      isdoctor: false
    });

    res.status(201).json({ success: true, message: 'Registration successful', user });
  } catch (error) {
    next(error);
  }
};

exports.registerDoctorController = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      specialisation,
      timings,
      availability,
      experience,
      fees,
      about,
      location
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      type: 'doctor',
      isdoctor: true
    });

    const doctor = await Doctor.create({
      userId: user._id,
      fullname: name,
      email,
      phone,
      address,
      specialisation,
      timings,
      availability: availability || timings,
      experience: Number(experience) || 0,
      fees: Number(fees) || 0,
      about,
      location,
      status: 'Pending Approval'
    });

    res.status(201).json({
      success: true,
      message: 'Doctor registration successful. Profile pending admin approval.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
        isdoctor: user.isdoctor
      },
      doctor
    });
  } catch (error) {
    next(error);
  }
};

exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.type === 'doctor') {
      return res.status(403).json({ success: false, message: 'Use Doctor Login for doctor accounts' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY || 'secretkey', { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
        isdoctor: user.isdoctor
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.doctorLoginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.type !== 'doctor') {
      return res.status(404).json({ success: false, message: 'Doctor account not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY || 'secretkey', { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
        isdoctor: user.isdoctor
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.authController = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfileController = async (req, res, next) => {
  try {
    const { name, phone, email } = req.body;
    const userId = req.userId || req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.email = email || user.email;
    await user.save();

    res.status(200).json({ success: true, message: 'Profile updated', user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    next(error);
  }
};

exports.docController = async (req, res, next) => {
  try {
    const { fullname, email, phone, address, specialisation, timings, availability, experience, fees, about, location } = req.body;
    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Doctor profile already exists' });
    }

    const doctor = await Doctor.create({
      userId,
      fullname,
      email,
      phone,
      address,
      specialisation,
      timings,
      availability: availability || timings,
      experience,
      fees,
      about,
      location,
      status: 'Pending Approval'
    });

    await User.findByIdAndUpdate(userId, { $push: { notification: { type: 'doctor-request', message: 'New doctor application submitted' } } });

    res.status(201).json({ success: true, message: 'Doctor application submitted', doctor });
  } catch (error) {
    next(error);
  }
};

exports.getallnotificationController = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const notifications = user.notification || [];
    user.seennotification = [...user.seennotification, ...notifications];
    user.notification = [];
    await user.save();

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

exports.deleteallnotificationController = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.notification = [];
    user.seennotification = [];
    await user.save();

    res.status(200).json({ success: true, message: 'Notifications cleared' });
  } catch (error) {
    next(error);
  }
};

exports.getAllDoctorsControllers = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.userId;
    const { search, specialty, specialisation, location, availability } = req.query;
    const filter = { status: { $in: ['Active', 'approved'] } };
    const andFilters = [];

    if (userId) {
      filter.userId = { $ne: userId };
    }

    const specialityTerm = (specialty || specialisation || '').trim();
    if (specialityTerm) {
      andFilters.push({ specialisation: { $regex: specialityTerm, $options: 'i' } });
    }

    const locationTerm = (location || '').trim();
    if (locationTerm) {
      andFilters.push({ location: { $regex: locationTerm, $options: 'i' } });
    }

    const availabilityTerm = (availability || '').trim();
    if (availabilityTerm) {
      andFilters.push({
        $or: [
          { availability: { $regex: availabilityTerm, $options: 'i' } },
          { timings: { $regex: availabilityTerm, $options: 'i' } }
        ]
      });
    }

    const searchTerm = (search || '').trim();
    if (searchTerm) {
      andFilters.push({
        $or: [
          { fullname: { $regex: searchTerm, $options: 'i' } },
          { specialisation: { $regex: searchTerm, $options: 'i' } },
          { location: { $regex: searchTerm, $options: 'i' } },
          { availability: { $regex: searchTerm, $options: 'i' } },
          { timings: { $regex: searchTerm, $options: 'i' } }
        ]
      });
    }

    if (andFilters.length) {
      filter.$and = andFilters;
    }

    const doctors = await Doctor.find(filter);
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    next(error);
  }
};

exports.appointmentController = async (req, res, next) => {
  try {
    const { doctorInfo, date, time } = req.body;
    const userInfo = req.userId || req.body.userInfo || req.body.userId;
    const file = req.files?.document?.[0] || req.files?.image?.[0] || req.file;
    const documentPath = file ? file.path : '';

    if (!userInfo || !doctorInfo || !date || !time) {
      return res.status(400).json({ success: false, message: 'Doctor, date and time are required' });
    }

    const selectedSlot = moment(`${date} ${time}`, ['YYYY-MM-DD HH:mm', moment.ISO_8601], true);
    if (!selectedSlot.isValid()) {
      return res.status(400).json({ success: false, message: 'Invalid appointment slot' });
    }

    const appointment = await Appointment.create({
      doctorInfo,
      userInfo,
      date: selectedSlot.format('YYYY-MM-DD'),
      time: selectedSlot.format('HH:mm'),
      status: 'Under Review',
      document: documentPath
    });

    const doctor = await Doctor.findById(doctorInfo);
    if (doctor) {
      const doctorUser = await User.findById(doctor.userId);
      if (doctorUser) {
        doctorUser.notification.push({
          type: 'appointment-request',
          message: `New appointment request received for ${selectedSlot.format('DD MMM YYYY HH:mm')}`
        });
        await doctorUser.save();
      }
    }

    const patient = await User.findById(userInfo);
    if (patient) {
      patient.notification.push({
        type: 'appointment-booked',
        message: 'Your appointment request is under review.'
      });
      await patient.save();
    }

    res.status(201).json({ success: true, message: 'Appointment booked', appointment });
  } catch (error) {
    next(error);
  }
};

exports.getAllUserAppointments = async (req, res, next) => {
  try {
    const userId = req.userId || req.body.userId;
    const appointments = await Appointment.find({ userInfo: userId }).populate('doctorInfo');

    const result = appointments.map((appointment) => ({
      ...appointment.toObject(),
      docName: appointment.doctorInfo?.fullname || 'Doctor'
    }));

    res.status(200).json({ success: true, appointments: result });
  } catch (error) {
    next(error);
  }
};

exports.cancelUserAppointmentController = async (req, res, next) => {
  try {
    const userId = req.userId || req.body.userId;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userInfo: userId, status: { $in: ['Under Review', 'Scheduled'] } },
      { status: 'Cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found or cannot be cancelled' });
    }

    res.status(200).json({ success: true, message: 'Appointment cancelled', appointment });
  } catch (error) {
    next(error);
  }
};

exports.getDocsController = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    res.status(200).json({ success: true, documents: user?.documents || [] });
  } catch (error) {
    next(error);
  }
};
