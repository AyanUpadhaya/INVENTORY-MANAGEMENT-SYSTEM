import { useAddProductMutation } from "../features/products/productApi";
import toast from "react-hot-toast";
import { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import PageTitle from "../components/shared/PageTitle";

const AddProduct = () => {
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [form, setForm] = useState({ name: "", price: "" });
  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      await addProduct(form).unwrap();
      toast.success("Product Added!");
      navigate("/dashboard/products");
    } catch {
      toast.error("Failed");
    }
  };
  const content = (
    <div className="p-4">
      <PageTitle>Add Product</PageTitle>

      <div className="max-w-md bg-white rounded-md p-4 space-y-4">
        <Input
          placeholder="Product name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Price"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <Button disabled={isLoading} onClick={handleAdd}>
          {isLoading ? "Adding.." : "Add Product"}
        </Button>
      </div>
    </div>
  );

  return content;
};

export default AddProduct;
