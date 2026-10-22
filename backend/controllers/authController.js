// Authentication Controller
// Handles customer login and JWT issuance
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

// Helper function to generate JWT token for authenticated customer
const generateToken = (customer) => {
  return jwt.sign(
    {
      id: customer._id,
      email: customer.email,
      role: customer.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// POST /api/v1/auth/login
// Logs in customer by verifying email and licenseNumber
const login = async (req, res, next) => {
  try {
    const { email, licenseNumber } = req.body;

    // Check for missing credentials (400)
    if (!email || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: 'Email and license number are required',
        status: 400
      });
    }

    // Find customer in database by email and license number
    const customer = await Customer.findOne({
      email: email.trim().toLowerCase(),
      licenseNumber: licenseNumber.trim()
    });

    // Check if customer exists (401)
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials: No matching customer found',
        status: 401
      });
    }

    // Generate token and return customer data
    const token = generateToken(customer);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        licenseNumber: customer.licenseNumber,
        role: customer.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login
};
