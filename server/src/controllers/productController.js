import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) return res.status(400).json({ message: "All fields required" });

  const product = await Product.create({
    name,
    price,
    createdBy: req.userId
  });

  res.status(201).json(product);
};

export const getProducts = async (req, res) => {
  const products = await Product.find({}).populate("createdBy", "name email");
  res.status(200).json(products);
};

export const deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
