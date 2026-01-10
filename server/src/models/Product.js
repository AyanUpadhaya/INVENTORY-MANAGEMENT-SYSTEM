import mongoose from "mongoose";

/*

Real-world example:
Let's say you sell t-shirts:

Reorder Level: 30 units
Reorder Quantity: 150 units

When your inventory drops to 30 t-shirts, the system alerts you (or automatically orders) 150 more units. This ensures you don't run out of stock while waiting for the new shipment.

*/

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    unit_price: { type: Number, required: true },
    sku: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cateogry",
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reorder_level: { type: Number, default: 0 },
    reorder_quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
