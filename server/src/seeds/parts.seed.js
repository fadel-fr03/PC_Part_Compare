require('dotenv').config();
const mongoose = require('mongoose');
const Part = require('../models/Part');
const connectDB = require('../config/db');

const sampleParts = [
  // CPUs
  {
    name: "AMD Ryzen 9 7950X",
    category: "CPU",
    manufacturer: "AMD",
    price: 549.99,
    specifications: {
      cores: "16",
      threads: "32",
      baseClock: "4.5 GHz",
      boostClock: "5.7 GHz",
      socket: "AM5",
      tdp: "170W"
    },
    imageUrl: "https://placehold.co/400x300/1a1a2e/00cfff?text=AMD+Ryzen+9+7950X",
    averageRating: 4.7
  },
  {
    name: "Intel Core i9-14900K",
    category: "CPU",
    manufacturer: "Intel",
    price: 589.99,
    specifications: {
      cores: "24",
      threads: "32",
      baseClock: "3.2 GHz",
      boostClock: "6.0 GHz",
      socket: "LGA1700",
      tdp: "125W"
    },
    imageUrl: "https://placehold.co/400x300/1a1a2e/00cfff?text=Intel+i9-14900K",
    averageRating: 4.6
  },
  {
    name: "AMD Ryzen 5 7600X",
    category: "CPU",
    manufacturer: "AMD",
    price: 229.99,
    specifications: {
      cores: "6",
      threads: "12",
      baseClock: "4.7 GHz",
      boostClock: "5.3 GHz",
      socket: "AM5",
      tdp: "105W"
    },
    imageUrl: "https://placehold.co/400x300/1a1a2e/00cfff?text=AMD+Ryzen+5+7600X",
    averageRating: 4.5
  },

  // GPUs
  {
    name: "NVIDIA GeForce RTX 4090",
    category: "GPU",
    manufacturer: "NVIDIA",
    price: 1599.99,
    specifications: {
      memory: "24GB GDDR6X",
      coreClock: "2.23 GHz",
      boostClock: "2.52 GHz",
      cudaCores: "16384",
      tdp: "450W"
    },
    imageUrl: "https://placehold.co/400x300/1a1a2e/a855f7?text=RTX+4090",
    averageRating: 4.9
  },
  {
    name: "AMD Radeon RX 7900 XTX",
    category: "GPU",
    manufacturer: "AMD",
    price: 999.99,
    specifications: {
      memory: "24GB GDDR6",
      gameClock: "2.3 GHz",
      boostClock: "2.5 GHz",
      streamProcessors: "6144",
      tdp: "355W"
    },
    imageUrl: "https://placehold.co/400x300/1a1a2e/a855f7?text=RX+7900+XTX",
    averageRating: 4.6
  },
  {
    name: "NVIDIA GeForce RTX 4070",
    category: "GPU",
    manufacturer: "NVIDIA",
    price: 549.99,
    specifications: {
      memory: "12GB GDDR6X",
      coreClock: "1.92 GHz",
      boostClock: "2.48 GHz",
      cudaCores: "5888",
      tdp: "200W"
    },
    imageUrl: "https://placehold.co/400x300/1a1a2e/a855f7?text=RTX+4070",
    averageRating: 4.7
  },

  // RAM
  {
    name: "Corsair Vengeance DDR5 32GB",
    category: "RAM",
    manufacturer: "Corsair",
    price: 129.99,
    specifications: {
      capacity: "32GB",
      type: "DDR5",
      speed: "6000 MHz",
      cas: "CL36",
      modules: "2x16GB",
      voltage: "1.35V"
    },
    imageUrl: "https://placehold.co/400x300/1a1a2e/34d399?text=Corsair+DDR5+32GB",
    averageRating: 4.8
  },
  {
    name: "G.Skill Trident Z5 RGB 64GB",
    category: "RAM",
    manufacturer: "G.Skill",
    price: 249.99,
    specifications: {
      capacity: "64GB",
      type: "DDR5",
      speed: "6400 MHz",
      cas: "CL32",
      modules: "2x32GB",
      voltage: "1.4V"
    },
    imageUrl: "https://placehold.co/400x300/1a1a2e/34d399?text=G.Skill+Trident+Z5",
    averageRating: 4.7
  },

  // Storage
  {
    name: "Samsung 990 PRO 2TB NVMe SSD",
    category: "Storage",
    manufacturer: "Samsung",
    price: 179.99,
    specifications: {
      capacity: "2TB",
      interface: "PCIe 4.0 x4",
      formFactor: "M.2 2280",
      readSpeed: "7450 MB/s",
      writeSpeed: "6900 MB/s",
      type: "NVMe SSD"
    },
    imageUrl: "https://placehold.co/400x300/1a1a2e/f59e0b?text=Samsung+990+PRO+2TB",
    averageRating: 4.9
  },

  // Motherboard
  {
    name: "ASUS ROG STRIX X670E-E",
    category: "Motherboard",
    manufacturer: "ASUS",
    price: 449.99,
    specifications: {
      socket: "AM5",
      chipset: "X670E",
      formFactor: "ATX",
      memorySlots: "4",
      maxMemory: "128GB",
      pcie: "PCIe 5.0"
    },
    imageUrl: "https://placehold.co/400x300/1a1a2e/fb923c?text=ASUS+ROG+X670E",
    averageRating: 4.8
  }
];

const seedParts = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing parts
    await Part.deleteMany({});
    console.log('🗑️  Cleared existing parts from database');

    // Insert sample parts
    const insertedParts = await Part.insertMany(sampleParts);
    console.log(`✅ Successfully seeded ${insertedParts.length} parts to database`);

    // Display summary
    console.log('\n📊 Seeded Parts Summary:');
    const summary = insertedParts.reduce((acc, part) => {
      acc[part.category] = (acc[part.category] || 0) + 1;
      return acc;
    }, {});
    Object.entries(summary).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedParts();
