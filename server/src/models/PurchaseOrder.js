import mongoose from "mongoose";

const purchaseOrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  // Store product details at time of PO (for historical accuracy)
  productSnapshot: {
    sku: { type: String, required: true },
    name: { type: String, required: true },
    description: String
  },
  quantity_ordered: {
    type: Number,
    required: true,
    min: [1, 'Quantity ordered must be at least 1']
  },
  quantity_received: {
    type: Number,
    default: 0,
    min: [0, 'Quantity received cannot be negative']
  },
  quantity_pending: {
    type: Number,
    default: 0,
    min: [0, 'Quantity pending cannot be negative']
  },
  unit_price: {
    type: Number,
    required: true,
    min: [0, 'Unit price cannot be negative']
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  // Track partial receipts
  receipts: [{
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Receipt quantity must be at least 1']
    },
    received_date: {
      type: Date,
      default: Date.now
    },
    received_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String,
    condition: {
      type: String,
      enum: ['Good', 'Damaged', 'Partial'],
      default: 'Good'
    }
  }],
  // Item status
  item_status: {
    type: String,
    enum: ['Pending', 'Partially Received', 'Fully Received', 'Cancelled'],
    default: 'Pending'
  },
  notes: String
}, { _id: true });


// Main PurchaseOrder Schema
const purchaseOrderSchema = new mongoose.Schema({
  po_number: {
    type: String,
    required: true,
    unique: true,
    // Auto-generate: PO-2025-0001
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  // Embedded purchase order items array
  items: {
    type: [purchaseOrderItemSchema],
    validate: [arrayMinLength, 'Purchase order must have at least one item']
  },
  // Financial details
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
  // Payment information
  payment_terms: {
    type: String,
    enum: ['Cash on Delivery', 'Advance Payment', 'Due on Receipt'],
    default: 'Cash on Delivery'
  },
  payment_status: {
    type: String,
    enum: ['Unpaid', 'Partially Paid', 'Paid'],
    default: 'Unpaid'
  },
  // Status tracking
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Ordered', 'Partially Received', 'Received', 'Cancelled', 'Closed'],
    default: 'Pending'
  },
  // Important dates
  order_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  expected_delivery_date: {
    type: Date,
    required: true
  },
  actual_delivery_date: Date,
  approved_date: Date,
  rejected_date: Date,
  ordered_date: Date,
  received_date: Date,
  cancelled_date: Date,
  
  // Approval workflow
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejected_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Status history for audit trail
  status_history: [{
    status: String,
    changed_at: {
      type: Date,
      default: Date.now
    },
    changed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  
  // Additional information
  notes: String,
  rejection_reason: String,
  cancellation_reason: String,
  
  // Supplier reference
  supplier_reference_number: String,
  supplier_invoice_number: String,
  
  // Shipping information
  shipping_method: {
    type: String,
    enum: ['Air Freight', 'Sea Freight', 'Ground Shipping', 'Courier', 'Pickup'],
    default: 'Ground Shipping'
  },
  tracking_number: String,
  carrier: String,
  
  // Auto-generation flag
  is_auto_generated: {
    type: Boolean,
    default: false
  },
  auto_generation_reason: String,
  
  // Priority
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Urgent'],
    default: 'Normal'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Validation function
function arrayMinLength(val) {
  return val.length > 0;
}


purchaseOrderSchema.index({ po_number: 1 });
purchaseOrderSchema.index({ supplier: 1 });
purchaseOrderSchema.index({ warehouse: 1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ order_date: -1 });
purchaseOrderSchema.index({ expected_delivery_date: 1 });
purchaseOrderSchema.index({ created_by: 1 });
purchaseOrderSchema.index({ approved_by: 1 });
purchaseOrderSchema.index({ is_auto_generated: 1 });



// Pre-save: Auto-generate PO number
purchaseOrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.po_number) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('PurchaseOrder').countDocuments();
    this.po_number = `PO-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Pre-save: Calculate subtotal and total
purchaseOrderSchema.pre('save', function(next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Calculate total amount
  this.total_amount = this.subtotal + this.tax_amount + this.shipping_cost - this.discount_amount;
  
  next();
});

// Pre-save: Calculate quantity_pending for each item
purchaseOrderSchema.pre('save', function(next) {
  this.items.forEach(item => {
    item.quantity_pending = item.quantity_ordered - item.quantity_received;
    
    // Update item status based on quantities
    if (item.quantity_received === 0) {
      item.item_status = 'Pending';
    } else if (item.quantity_received < item.quantity_ordered) {
      item.item_status = 'Partially Received';
    } else if (item.quantity_received === item.quantity_ordered) {
      item.item_status = 'Fully Received';
    }
  });
  next();
});

// Pre-save: Update overall PO status based on items
purchaseOrderSchema.pre('save', function(next) {
  // Skip if PO is cancelled or rejected
  if (['Cancelled', 'Rejected', 'Closed'].includes(this.status)) {
    return next();
  }
  
  // Check if status should be updated based on items
  const allFullyReceived = this.items.every(item => item.quantity_received === item.quantity_ordered);
  const someReceived = this.items.some(item => item.quantity_received > 0);
  
  // Auto-update status if items are being received
  if (this.status === 'Ordered') {
    if (allFullyReceived) {
      this.status = 'Received';
      this.received_date = new Date();
    } else if (someReceived) {
      this.status = 'Partially Received';
    }
  }
  
  next();
});

// Pre-save: Add to status history when status changes
purchaseOrderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.status_history.push({
      status: this.status,
      changed_at: new Date(),
      changed_by: this.updated_by,
      notes: `Status changed to ${this.status}`
    });
    
    // Set date fields based on status
    if (this.status === 'Approved' && !this.approved_date) {
      this.approved_date = new Date();
    } else if (this.status === 'Rejected' && !this.rejected_date) {
      this.rejected_date = new Date();
    } else if (this.status === 'Ordered' && !this.ordered_date) {
      this.ordered_date = new Date();
    } else if (this.status === 'Received' && !this.received_date) {
      this.received_date = new Date();
      this.actual_delivery_date = new Date();
    } else if (this.status === 'Cancelled' && !this.cancelled_date) {
      this.cancelled_date = new Date();
    }
  }
  next();
});
