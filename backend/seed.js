// Seed Database with initial test data
require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected successfully.');

    // Clear existing data
    await Booking.deleteMany({});
    await Vehicle.deleteMany({});
    await Customer.deleteMany({});
    console.log('[Seed] Cleared existing collections.');

    // 1 Admin and 2 Customers
    const customers = await Customer.insertMany([
      {
        name: 'Alice Admin',
        email: 'admin@driveeasy.com',
        phone: '123-456-7890',
        licenseNumber: 'DL-ADMIN-001',
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-111-2222',
        licenseNumber: 'DL-1001',
        role: 'customer'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '555-333-4444',
        licenseNumber: 'DL-2002',
        role: 'customer'
      }
    ]);
    console.log(`[Seed] Inserted ${customers.length} customers (1 admin, 2 customers).`);

    // 8 Vehicles (mixed types: Hatchback, Sedan, SUV with a few unavailable)
    const vehicles = await Vehicle.insertMany([
      { model: 'Hyundai i20', type: 'Hatchback', pricePerDay: 40, available: true },
      { model: 'Volkswagen Polo', type: 'Hatchback', pricePerDay: 45, available: false },
      { model: 'Maruti Swift', type: 'Hatchback', pricePerDay: 35, available: true },
      { model: 'Honda City', type: 'Sedan', pricePerDay: 60, available: true },
      { model: 'Toyota Camry', type: 'Sedan', pricePerDay: 85, available: false },
      { model: 'Hyundai Verna', type: 'Sedan', pricePerDay: 65, available: true },
      { model: 'Hyundai Creta', type: 'SUV', pricePerDay: 75, available: true },
      { model: 'Toyota Fortuner', type: 'SUV', pricePerDay: 120, available: true }
    ]);
    console.log(`[Seed] Inserted ${vehicles.length} vehicles.`);

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error.message);
    process.exit(1);
  }
};

seedData();
