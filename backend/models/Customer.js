// Customer Model Schema
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'fleetmanager', 'admin'],
        message: 'Role must be customer, fleetmanager, or admin'
      },
      default: 'customer'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
