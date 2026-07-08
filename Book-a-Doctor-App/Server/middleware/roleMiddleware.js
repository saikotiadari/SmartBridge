const User = require('../models/userModel');

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(req.userId).select('type');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.type !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { requireAdmin };
