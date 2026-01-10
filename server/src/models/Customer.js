import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    shipping_address: {
      street: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
    },
    billing_address: {
      street: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
    },
  },
  { timestamps: true }
);
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });

export default mongoose.model("Customer", customerSchema);
