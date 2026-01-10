// controllers/inventoryController.js
// const Inventory from "../models/Inventory.js";
// const Product from "../models/Product.js"
// const Warehouse from "../models/Warehouse.js";

import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import Warehouse from "../models/Warehouse.js"



/**
 * Get all inventory with filters
 * GET /api/inventory
 * Query params: warehouse, stockLevel, search, page, limit
 */
export const getAllInventory = async (req, res) => {
  try {
    const {
      warehouse,      // Filter by warehouse ID
      stockLevel,     // Filter: 'all', 'in-stock', 'low-stock', 'out-of-stock'
      search,         // Search by product name or SKU
      page = 1,
      limit = 20,
      sortBy = 'product', // Sort by: 'product', 'warehouse', 'quantity'
      sortOrder = 'asc'   // 'asc' or 'desc'
    } = req.query;

    // Build filter query
    const filter = { status: 'Active' };

    // Filter by warehouse
    if (warehouse && warehouse !== 'all') {
      filter.warehouse = warehouse;
    }

    // Filter by stock level
    if (stockLevel && stockLevel !== 'all') {
      switch (stockLevel) {
        case 'in-stock':
          filter.quantity_available = { $gt: 0 };
          filter.is_low_stock = false;
          break;
        case 'low-stock':
          filter.is_low_stock = true;
          break;
        case 'out-of-stock':
          filter.is_out_of_stock = true;
          break;
      }
    }

    // Build aggregation pipeline for search
    let pipeline = [
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $lookup: {
          from: 'warehouses',
          localField: 'warehouse',
          foreignField: '_id',
          as: 'warehouseDetails'
        }
      },
      { $unwind: '$warehouseDetails' },
      {
        $match: {
          status: 'Active',
          ...(warehouse && warehouse !== 'all' ? { warehouse: mongoose.Types.ObjectId(warehouse) } : {})
        }
      }
    ];

    // Add search filter
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'productDetails.name': { $regex: search, $options: 'i' } },
            { 'productDetails.sku': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Add stock level filter
    if (stockLevel && stockLevel !== 'all') {
      switch (stockLevel) {
        case 'in-stock':
          pipeline.push({
            $match: {
              quantity_available: { $gt: 0 },
              is_low_stock: false
            }
          });
          break;
        case 'low-stock':
          pipeline.push({
            $match: { is_low_stock: true }
          });
          break;
        case 'out-of-stock':
          pipeline.push({
            $match: { is_out_of_stock: true }
          });
          break;
      }
    }

    // Project fields for response
    pipeline.push({
      $project: {
        _id: 1,
        product_id: '$productDetails._id',
        product_name: '$productDetails.name',
        product_sku: '$productDetails.sku',
        warehouse_id: '$warehouseDetails._id',
        warehouse_name: '$warehouseDetails.name',
        quantity_on_hand: 1,
        quantity_reserved: 1,
        quantity_available: 1,
        is_low_stock: 1,
        is_out_of_stock: 1,
        stock_status: {
          $cond: {
            if: '$is_out_of_stock',
            then: 'Out of Stock',
            else: {
              $cond: {
                if: '$is_low_stock',
                then: 'Low Stock',
                else: 'In Stock'
              }
            }
          }
        },
        unit_cost: 1,
        total_value: 1,
        last_updated: 1,
        storage_location: 1
      }
    });

    // Sorting
    const sortField = sortBy === 'warehouse' ? 'warehouse_name' : 
                      sortBy === 'quantity' ? 'quantity_available' : 
                      'product_name';
    
    pipeline.push({
      $sort: { [sortField]: sortOrder === 'desc' ? -1 : 1 }
    });

    // Count total for pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Inventory.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    // Execute aggregation
    const inventory = await Inventory.aggregate(pipeline);

    // Response
    res.status(200).json({
      success: true,
      data: inventory,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total_items: total,
        total_pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory',
      error: error.message
    });
  }
};

/**
 * Get inventory for specific product across all warehouses
 * GET /api/inventory/product/:productId
 */
export const getInventoryByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const inventory = await Inventory.find({ 
      product: productId,
      status: 'Active'
    })
    .populate('warehouse', 'name warehouse_code location')
    .populate('product', 'name sku unit_price reorder_level')
    .sort({ warehouse: 1 });

    // Calculate totals across all warehouses
    const totals = {
      total_on_hand: 0,
      total_reserved: 0,
      total_available: 0,
      total_value: 0
    };

    inventory.forEach(inv => {
      totals.total_on_hand += inv.quantity_on_hand;
      totals.total_reserved += inv.quantity_reserved;
      totals.total_available += inv.quantity_available;
      totals.total_value += inv.total_value;
    });

    res.status(200).json({
      success: true,
      data: {
        inventory,
        totals
      }
    });

  } catch (error) {
    console.error('Error fetching product inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product inventory',
      error: error.message
    });
  }
};

/**
 * Get inventory for specific warehouse
 * GET /api/inventory/warehouse/:warehouseId
 */
export const getInventoryByWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const { stockLevel, search } = req.query;

    const filter = {
      warehouse: warehouseId,
      status: 'Active'
    };

    // Apply stock level filter
    if (stockLevel && stockLevel !== 'all') {
      switch (stockLevel) {
        case 'low-stock':
          filter.is_low_stock = true;
          break;
        case 'out-of-stock':
          filter.is_out_of_stock = true;
          break;
        case 'in-stock':
          filter.quantity_available = { $gt: 0 };
          filter.is_low_stock = false;
          break;
      }
    }

    let query = Inventory.find(filter)
      .populate('product', 'name sku unit_price reorder_level category')
      .sort({ product: 1 });

    const inventory = await query;

    // If search provided, filter in memory
    let filteredInventory = inventory;
    if (search) {
      filteredInventory = inventory.filter(inv => 
        inv.product.name.toLowerCase().includes(search.toLowerCase()) ||
        inv.product.sku.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Calculate warehouse totals
    const totals = {
      total_products: filteredInventory.length,
      total_quantity: filteredInventory.reduce((sum, inv) => sum + inv.quantity_on_hand, 0),
      total_value: filteredInventory.reduce((sum, inv) => sum + inv.total_value, 0),
      low_stock_count: filteredInventory.filter(inv => inv.is_low_stock).length,
      out_of_stock_count: filteredInventory.filter(inv => inv.is_out_of_stock).length
    };

    res.status(200).json({
      success: true,
      data: {
        inventory: filteredInventory,
        totals
      }
    });

  } catch (error) {
    console.error('Error fetching warehouse inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching warehouse inventory',
      error: error.message
    });
  }
};

/**
 * Get inventory statistics
 * GET /api/inventory/stats
 */
export const getInventoryStats = async (req, res) => {
  try {
    const stats = await Inventory.getInventoryStats();

    res.status(200).json({
      success: true,
      data: stats[0] || {}
    });

  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory statistics',
      error: error.message
    });
  }
};

/**
 * Get low stock items
 * GET /api/inventory/low-stock
 */
export const getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      is_low_stock: true,
      status: 'Active'
    })
    .populate('product', 'name sku reorder_level reorder_quantity supplier')
    .populate('warehouse', 'name warehouse_code')
    .populate('product.supplier', 'name contact_person')
    .sort({ quantity_available: 1 });

    res.status(200).json({
      success: true,
      count: lowStockItems.length,
      data: lowStockItems
    });

  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock items',
      error: error.message
    });
  }
};

/**
 * Adjust inventory (manual stock adjustment)
 * POST /api/inventory/adjust
 */
export const adjustInventory = async (req, res) => {
  try {
    const { product_id, warehouse_id, new_quantity, reason, adjustment_type } = req.body;
    const userId = req.user._id; // From auth middleware

    // Validation
    if (!product_id || !warehouse_id || new_quantity === undefined || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Product, warehouse, quantity, and reason are required'
      });
    }

    if (new_quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }

    // Find inventory
    const inventory = await Inventory.findOne({
      product: product_id,
      warehouse: warehouse_id
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory record not found'
      });
    }

    // Check if new quantity is below reserved
    if (new_quantity < inventory.quantity_reserved) {
      return res.status(400).json({
        success: false,
        message: `Cannot set quantity below reserved amount (${inventory.quantity_reserved} units reserved)`
      });
    }

    const oldQuantity = inventory.quantity_on_hand;

    // Adjust stock
    await inventory.adjustStock(new_quantity, reason, userId);

    // Log adjustment for audit trail
    // You might want a separate AuditLog model for this
    console.log(`Inventory adjusted: Product ${product_id}, Warehouse ${warehouse_id}`);
    console.log(`Old: ${oldQuantity}, New: ${new_quantity}, Reason: ${reason}`);

    res.status(200).json({
      success: true,
      message: 'Inventory adjusted successfully',
      data: {
        old_quantity: oldQuantity,
        new_quantity: inventory.quantity_on_hand,
        difference: inventory.quantity_on_hand - oldQuantity,
        quantity_available: inventory.quantity_available
      }
    });

  } catch (error) {
    console.error('Error adjusting inventory:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adjusting inventory'
    });
  }
};

/**
 * Transfer stock between warehouses
 * POST /api/inventory/transfer
 */
export const transferStock = async (req, res) => {
  try {
    const { product_id, from_warehouse, to_warehouse, quantity, reason } = req.body;
    const userId = req.user._id;

    // Validation
    if (!product_id || !from_warehouse || !to_warehouse || !quantity || !reason) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (from_warehouse === to_warehouse) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination warehouses must be different'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be positive'
      });
    }

    // Find source inventory
    const sourceInventory = await Inventory.findOne({
      product: product_id,
      warehouse: from_warehouse
    });

    if (!sourceInventory) {
      return res.status(404).json({
        success: false,
        message: 'Source inventory not found'
      });
    }

    // Check available stock
    if (sourceInventory.quantity_available < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient available stock. Available: ${sourceInventory.quantity_available}, Requested: ${quantity}`
      });
    }

    // Find destination inventory
    const destInventory = await Inventory.findOne({
      product: product_id,
      warehouse: to_warehouse
    });

    if (!destInventory) {
      return res.status(404).json({
        success: false,
        message: 'Destination inventory not found'
      });
    }

    // Perform transfer
    await sourceInventory.decreaseStock(quantity, userId);
    await destInventory.increaseStock(quantity, userId);

    // Add transfer notes
    sourceInventory.notes = `Transferred ${quantity} units to ${destInventory.warehouse}. Reason: ${reason}`;
    destInventory.notes = `Received ${quantity} units from ${sourceInventory.warehouse}. Reason: ${reason}`;
    
    await sourceInventory.save();
    await destInventory.save();

    res.status(200).json({
      success: true,
      message: 'Stock transferred successfully',
      data: {
        product: product_id,
        quantity_transferred: quantity,
        source: {
          warehouse: from_warehouse,
          remaining_quantity: sourceInventory.quantity_on_hand
        },
        destination: {
          warehouse: to_warehouse,
          new_quantity: destInventory.quantity_on_hand
        }
      }
    });

  } catch (error) {
    console.error('Error transferring stock:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error transferring stock'
    });
  }
};

/**
 * Get single inventory record details
 * GET /api/inventory/:id
 */
export const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('product', 'name sku unit_price reorder_level reorder_quantity')
      .populate('warehouse', 'name warehouse_code location')
      .populate('last_updated_by', 'name email')
      .populate('last_counted_by', 'name email');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: inventory
    });

  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory',
      error: error.message
    });
  }
};

