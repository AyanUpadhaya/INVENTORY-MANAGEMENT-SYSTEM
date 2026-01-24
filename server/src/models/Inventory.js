import mongoose from "mongoose";

/*

The flow:

Customer places order → Reserve stock
Warehouse picks and packs → Still reserved
Order ships → Reduce quantity_on_hand AND release reserved
Physical goods leave warehouse → Inventory decreased

*/

/*
Best Practice Flow:

Product Created → Inventory records auto-created (qty: 0)
Purchase Order Received → Inventory increased via receiving form (PRIMARY METHOD)
Manual Adjustments → Only for special cases (corrections, opening stock)
Customer Orders → Reserve stock → Ship → Decrease stock
Order cancelled -> releaseReservedStock → increase stock

*/

const inventorySchema = new mongoose.Schema(
  {
    inventory_code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    // Core inventory quantities
    quantity_on_hand: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Quantity on hand cannot be negative"],
    },
    quantity_reserved: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Quantity reserved cannot be negative"],
    },
    quantity_available: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Quantity available cannot be negative"],
    },
    // maximum stock levels for this warehouse
    max_stock_level: {
      type: Number,
      default: null,
    },

    // Last counted (physical inventory count)
    last_counted_date: Date,
    last_counted_quantity: Number,

    // Valuation
    unit_cost: {
      type: Number,
      default: 0,
      min: [0, "Unit cost cannot be negative"],
    },
    total_value: {
      type: Number,
      default: 0,
      min: [0, "Total value cannot be negative"],
    },
    // Status
    status: {
      type: String,
      enum: ["Active", "Inactive", "Quarantine", "Damaged"],
      default: "Active",
    },
    // Alerts
    is_low_stock: {
      type: Boolean,
      default: false,
    },
    is_out_of_stock: {
      type: Boolean,
      default: false,
    },
    // Last update tracking
    last_updated: {
      type: Date,
      default: Date.now,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Notes
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Ensure one inventory record per product per warehouse
inventorySchema.index({ product: 1, warehouse: 1 }, { unique: true });
inventorySchema.index({ warehouse: 1 });
inventorySchema.index({ product: 1 });
inventorySchema.index({ is_low_stock: 1 });
inventorySchema.index({ is_out_of_stock: 1 });
inventorySchema.index({ status: 1 });

// Pre-save: Auto-generate  code
inventorySchema.pre("save", async function (next) {
  if (!this.inventory_code) {
    const count = await mongoose.model("Inventory").countDocuments();
    const year = new Date().getFullYear();
    this.inventory_code = `INV-${year}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

inventorySchema.pre("save", function (next) {
  // CRITICAL BUSINESS RULE
  this.quantity_available = this.quantity_on_hand - this.quantity_reserved;

  // Ensure quantity_available is not negative
  if (this.quantity_available < 0) {
    return next(
      new Error(
        "Quantity available cannot be negative. Quantity reserved exceeds quantity on hand."
      )
    );
  }

  next();
});

// Pre-save: Calculate total value
inventorySchema.pre("save", function (next) {
  this.total_value = this.quantity_on_hand * this.unit_cost;
  next();
});

// Pre-save: Check stock levels and set alerts
inventorySchema.pre("save", async function (next) {
  const Product = mongoose.model("Product");
  const product = await Product.findById(this.product);

  if (product) {
    // Check if out of stock
    this.is_out_of_stock = this.quantity_available === 0;

    // Check if low stock (use product's reorder level)
    this.is_low_stock =
      this.quantity_available <= product.reorder_level &&
      this.quantity_available > 0;
  }

  next();
});

// Pre-save: Update last_updated timestamp
inventorySchema.pre("save", function (next) {
  if (
    this.isModified("quantity_on_hand") ||
    this.isModified("quantity_reserved")
  ) {
    this.last_updated = new Date();
  }
  next();
});

// Pre-save: Validate quantity_reserved doesn't exceed quantity_on_hand
inventorySchema.pre("save", function (next) {
  if (this.quantity_reserved > this.quantity_on_hand) {
    return next(new Error("Quantity reserved cannot exceed quantity on hand"));
  }
  next();
});

// ==================== INSTANCE METHODS ====================

// Increase stock (receiving goods)
inventorySchema.methods.increaseStock = function (quantity, userId) {
  if (quantity <= 0) {
    throw new Error("Quantity must be positive");
  }

  this.quantity_on_hand += quantity;
  this.updated_by = userId
  // quantity_available will be recalculated by middleware
  return this.save();
};

// Decrease stock (shipping goods)
inventorySchema.methods.decreaseStock = function (quantity, userId) {
  if (quantity <= 0) {
    throw new Error("Quantity must be positive");
  }

  if (this.quantity_on_hand < quantity) {
    throw new Error("Insufficient stock on hand");
  }

  this.quantity_on_hand -= quantity;
  this.updated_by = userId
  return this.save();
};

// Reserve stock (for orders)
inventorySchema.methods.reserveStock = function (quantity, userId) {
  if (quantity <= 0) {
    throw new Error("Quantity must be positive");
  }

  if (this.quantity_available < quantity) {
    throw new Error(
      `Insufficient available stock. Available: ${this.quantity_available}, Requested: ${quantity}`
    );
  }

  this.quantity_reserved += quantity;
  this.updated_by = userId
  return this.save();
};

// Release reserved stock (cancel order)
inventorySchema.methods.releaseReservedStock = function (quantity, userId) {
  if (quantity <= 0) {
    throw new Error("Quantity must be positive");
  }

  if (this.quantity_reserved < quantity) {
    throw new Error("Cannot release more than reserved");
  }

  this.quantity_reserved -= quantity;
  this.updated_by = userId
  return this.save();
};

// Ship reserved stock (fulfill order)
inventorySchema.methods.shipReservedStock = function (quantity, userId) {
  if (quantity <= 0) {
    throw new Error("Quantity must be positive");
  }

  if (this.quantity_reserved < quantity) {
    throw new Error("Cannot ship more than reserved");
  }

  if (this.quantity_on_hand < quantity) {
    throw new Error("Insufficient stock on hand");
  }

  this.quantity_on_hand -= quantity;
  this.quantity_reserved -= quantity;
  this.updated_by = userId
  return this.save();
};

// Adjust stock (inventory count correction)
inventorySchema.methods.adjustStock = function (newQuantity, reason, userId) {
  if (newQuantity < 0) {
    throw new Error("Quantity cannot be negative");
  }

  if (newQuantity < this.quantity_reserved) {
    throw new Error(
      `Cannot set quantity below reserved amount (${this.quantity_reserved})`
    );
  }

  this.quantity_on_hand = newQuantity;
  this.last_counted_date = new Date();
  this.last_counted_quantity = newQuantity;
  this.updated_by = userId
  this.notes = reason;

  return this.save();
};

// Get stock status
inventorySchema.methods.getStockStatus = function () {
  if (this.is_out_of_stock) return "Out of Stock";
  if (this.is_low_stock) return "Low Stock";
  return "In Stock";
};

// Check if product needs reorder
inventorySchema.methods.needsReorder = async function () {
  const Product = mongoose.model("Product");
  const product = await Product.findById(this.product);

  if (product) {
    return this.quantity_available <= product.reorder_level;
  }
  return false;
};

// ==================== STATIC METHODS ====================

// Find inventory by product across all warehouses
inventorySchema.statics.findByProduct = function (productId) {
  return this.find({ product: productId })
    .populate("warehouse", "name warehouse_code location")
    .sort({ quantity_available: -1 });
};

// Find inventory by warehouse
inventorySchema.statics.findByWarehouse = function (warehouseId) {
  return this.find({ warehouse: warehouseId })
    .populate("product", "name sku unit_price")
    .sort({ product: 1 });
};

// Find low stock items
inventorySchema.statics.findLowStock = function () {
  return this.find({ is_low_stock: true, status: "Active" })
    .populate("product", "name sku reorder_level reorder_quantity supplier")
    .populate("warehouse", "name warehouse_code");
};

// Find out of stock items
inventorySchema.statics.findOutOfStock = function () {
  return this.find({ is_out_of_stock: true, status: "Active" })
    .populate("product", "name sku")
    .populate("warehouse", "name warehouse_code");
};

// Get total available quantity for a product across all warehouses
inventorySchema.statics.getTotalAvailable = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: mongoose.Types.ObjectId(productId), status: "Active" },
    },
    { $group: { _id: null, total: { $sum: "$quantity_available" } } },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

// Get inventory value by warehouse
inventorySchema.statics.getValueByWarehouse = function (warehouseId) {
  return this.aggregate([
    {
      $match: {
        warehouse: mongoose.Types.ObjectId(warehouseId),
        status: "Active",
      },
    },
    { $group: { _id: null, total_value: { $sum: "$total_value" } } },
  ]);
};

// Get inventory statistics
inventorySchema.statics.getInventoryStats = function () {
  return this.aggregate([
    { $match: { status: "Active" } },
    {
      $group: {
        _id: null,
        total_products: { $sum: 1 },
        total_quantity: { $sum: "$quantity_on_hand" },
        total_available: { $sum: "$quantity_available" },
        total_reserved: { $sum: "$quantity_reserved" },
        total_value: { $sum: "$total_value" },
        low_stock_count: {
          $sum: { $cond: ["$is_low_stock", 1, 0] },
        },
        out_of_stock_count: {
          $sum: { $cond: ["$is_out_of_stock", 1, 0] },
        },
      },
    },
  ]);
};

// Find products with stock in multiple warehouses
inventorySchema.statics.findProductsInMultipleWarehouses = function () {
  return this.aggregate([
    { $match: { status: "Active", quantity_on_hand: { $gt: 0 } } },
    {
      $group: {
        _id: "$product",
        warehouse_count: { $sum: 1 },
        warehouses: { $push: "$warehouse" },
        total_quantity: { $sum: "$quantity_on_hand" },
      },
    },
    { $match: { warehouse_count: { $gt: 1 } } },
  ]);
};

// ==================== VIRTUALS ====================

// Virtual for stock health percentage
inventorySchema.virtual("stock_health").get(function () {
  if (this.max_stock_level && this.max_stock_level > 0) {
    return (this.quantity_available / this.max_stock_level) * 100;
  }
  return null;
});

export default mongoose.model("Inventory", inventorySchema);
