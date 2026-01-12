import React from "react";
import PageTitle from "../../components/shared/PageTitle";
import toast from "react-hot-toast";
import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAddCategoryMutation } from "../../features/categories/categoriesApi";
import { Loader2, Loader2Icon, ChevronLeft } from "lucide-react";
import Textarea from "../../components/ui/Textarea";
const AddCategory = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [addCategory, { isLoading }] = useAddCategoryMutation();
  const navigate = useNavigate();
  const getLength = (text) => text.length;

  const handleAdd = async (ev) => {
    ev.preventDefault();
    try {
      const { name, description } = form;
      if (!name || !description)
        return toast.error("Both name and description are required");

      if (getLength(name) < 2)
        return toast.error("Name should have at least more than 2 characters");
      if (getLength(description) < 10)
        return toast.error(
          "Description should have at least more than 10 characters"
        );
      await addCategory(form).unwrap();
      toast.success("Category Added!");
      navigate("/dashboard/categories");
    } catch (error) {
      toast.error(error?.data?.message ?? "Failed to create category");
    }
  };
  return (
    <div className="p-4">
      <div className="max-w-full bg-white rounded-md p-4 space-y-4">
        <div className="flex justify-between gap-3 items-center">
          <Button onClick={() => navigate(-1)} size="sm">
            <ChevronLeft></ChevronLeft>
            <span>Back</span>
          </Button>
          <PageTitle>Add Category</PageTitle>
        </div>
        <form className="space-y-4" onSubmit={handleAdd}>
          <Input
            placeholder="Category name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Textarea
            placeholder="Category Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {isLoading ? "Adding.." : "Add Category"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
