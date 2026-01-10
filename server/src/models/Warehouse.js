import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
  warehouse_code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    // e.g., WH-NYC-01, WH-LA-02
  },
  name: {
    type: String,
    required: [true, 'Warehouse name is required'],
    trim: true,
    unique: true
  },
  // Location details
  location: {
    address: {
      street: String,
      city: { type: String, required: true },
      state: String,
      postal_code: String,
      country: { type: String, required: true }
    },
  },
  // Contact information
  manager: {
    type: String,
    required: true,
    trim: true
  },
  contact_email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  contact_phone: {
    type: String,
    trim: true
  },
  // Capacity tracking
  capacity: {
    total_space: {
      type: Number,
      required: true,
      min: [0, 'Capacity cannot be negative']
      // Unit: square meters or cubic meters
    },
    unit: {
      type: String,
      enum: ['sqm', 'cbm', 'pallets'],
      default: 'sqm'
    }
  },
  // Warehouse status
  is_active: {
    type: Boolean,
    default: true
  },
  warehouse_type: {
    type: String,
    enum: ['Main', 'Regional', 'Distribution Center', 'Fulfillment Center', 'Storage'],
    default: 'Main'
  },
  
  // Additional information
  notes: String,
  // User tracking
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});
// Pre-save: Auto-generate warehouse code
warehouseSchema.pre('save', async function(next) {
  if (!this.warehouse_code) {
    const count = await mongoose.model('Warehouse').countDocuments();
    const cityCode = this.location.address.city.substring(0, 3).toUpperCase();
    this.warehouse_code = `WH-${cityCode}-${String(count + 1).padStart(2, '0')}`;
  }
  next();
});


// Find warehouses by type
warehouseSchema.statics.findByType = function(type) {
  return this.find({ warehouse_type: type, is_active: true });
};

// Virtual for full address
warehouseSchema.virtual('full_address').get(function() {
  const addr = this.location.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.postal_code}, ${addr.country}`;
});

export default mongoose.model("Warehouse", warehouseSchema);