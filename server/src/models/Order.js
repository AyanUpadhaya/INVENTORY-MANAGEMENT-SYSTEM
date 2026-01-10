// models/Order.js
import mongoose from "mongoose";

// Embedded OrderItem Schema (not a separate collection)
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  // Store product details at time of order (for historical accuracy)
  productSnapshot: {
    sku: { type: String, required: true },
    name: { type: String, required: true },
    description: String
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  unit_price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  // Track which warehouse this item was fulfilled from
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse'
  }
}, { _id: true }); // Keep _id for each item

// Main Order Schema
const orderSchema = new mongoose.Schema({
  order_number: {
    type: String,
    required: true,
    unique: true,
    // Auto-generate: ORD-2025-0001
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  // Embedded order items array
  items: {
    type: [orderItemSchema],
    validate: [arrayMinLength, 'Order must have at least one item']
  },
  // Order financial details
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  tax_amount: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  shipping_cost: {
    type: Number,
    default: 0,
    min: [0, 'Shipping cost cannot be negative']
  },
  discount_amount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  total_amount: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  // Order status tracking
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  // Shipping information
  shipping_method: {
    type: String,
    enum: ['Standard', 'Express', 'Overnight', 'Pickup'],
    default: 'Standard'
  },
  shipping_address: {
    street: String,
    city: String,
    state: String,
    postal_code: String,
    country: String
  },
  billing_address: {
    street: String,
    city: String,
    state: String,
    postal_code: String,
    country: String
  },
  // Tracking information
  tracking_number: String,
  carrier: String, // FedEx, UPS, DHL, etc.
  
  // Important dates
  order_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  processing_date: Date,
  shipped_date: Date,
  delivered_date: Date,
  cancelled_date: Date,
  
  // Status history for audit trail
  status_history: [{
    status: String,
    changed_at: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Additional information
  notes: String,
  internal_notes: String, // Not visible to customer
  cancellation_reason: String,
  
  // User tracking
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Payment information (optional)
  payment_status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  payment_method: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Bank Transfer', 'PayPal', 'Other']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Validation function
function arrayMinLength(val) {
  return val.length > 0;
}

// ==================== MIDDLEWARE ====================

// Pre-save: Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.order_number) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Order').countDocuments();
    this.order_number = `ORD-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Pre-save: Calculate totals
orderSchema.pre('save', function(next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Calculate total
  this.total_amount = this.subtotal + this.tax_amount + this.shipping_cost - this.discount_amount;
  
  next();
});

// Pre-save: Add to status history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.status_history.push({
      status: this.status,
      changed_at: new Date(),
      notes: `Status changed to ${this.status}`
    });
    
    // Set date fields based on status
    if (this.status === 'Processing' && !this.processing_date) {
      this.processing_date = new Date();
    } else if (this.status === 'Shipped' && !this.shipped_date) {
      this.shipped_date = new Date();
    } else if (this.status === 'Delivered' && !this.delivered_date) {
      this.delivered_date = new Date();
    } else if (this.status === 'Cancelled' && !this.cancelled_date) {
      this.cancelled_date = new Date();
    }
  }
  next();
});

// ==================== INSTANCE METHODS ====================

// Calculate order item subtotal
orderSchema.methods.calculateItemSubtotal = function(quantity, unit_price) {
  return quantity * unit_price;
};

// Check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return ['Pending', 'Processing'].includes(this.status);
};

// Check if order can be edited
orderSchema.methods.canBeEdited = function() {
  return this.status === 'Pending';
};

// Get total items count
orderSchema.methods.getTotalItems = function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
};

// ==================== STATIC METHODS ====================

// Find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

// Find orders by date range
orderSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    order_date: {
      $gte: startDate,
      $lte: endDate
    }
  });
};

// Get sales statistics
orderSchema.statics.getSalesStats = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        order_date: { $gte: startDate, $lte: endDate },
        status: { $nin: ['Cancelled'] }
      }
    },
    {
      $group: {
        _id: null,
        total_orders: { $sum: 1 },
        total_revenue: { $sum: '$total_amount' },
        average_order_value: { $avg: '$total_amount' }
      }
    }
  ]);
};

// ==================== INDEXES ====================
orderSchema.index({ order_number: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ order_date: -1 });
orderSchema.index({ created_by: 1 });

// ==================== VIRTUALS ====================

// Virtual for order age in days
orderSchema.virtual('age_in_days').get(function() {
  return Math.floor((new Date() - this.order_date) / (1000 * 60 * 60 * 24));
});

// Virtual for is_overdue (if shipped_date is past expected delivery)
orderSchema.virtual('is_overdue').get(function() {
  if (this.status === 'Shipped' && this.expected_delivery_date) {
    return new Date() > this.expected_delivery_date && this.status !== 'Delivered';
  }
  return false;
});

export default mongoose.model('Order', orderSchema);