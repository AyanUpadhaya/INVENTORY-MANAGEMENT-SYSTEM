import React, { useEffect } from "react";
import PageTitle from "../../components/shared/PageTitle";
import toast from "react-hot-toast";
import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryByIdMutation,
} from "../../features/categories/categoriesApi";
import { Loader2, Loader2Icon, ChevronLeft } from "lucide-react";
import Textarea from "../../components/ui/Textarea";

const EditCategory = () => {
  const { id } = useParams();
  const { data: category, isLoading } = useGetCategoryByIdQuery(id);
  const [updateCategoryById, { isLoading: isUpdating }] =
    useUpdateCategoryByIdMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((prev) => ({
        ...prev,
        name: category?.name,
        description: category?.description,
      }));
    }
  }, [category]);

  const navigate = useNavigate();
  const getLength = (text) => text.length;

  const handleUpdate = async (ev) => {
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
      await updateCategoryById({
        id: id,
        payload: { name, description },
      }).unwrap();
      toast.success("Category Updated!");
      navigate("/dashboard/categories");
    } catch (error) {
      toast.error(error?.data?.message ?? "Failed to create category");
    }
  };
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="p-4">
      <div className="max-w-full bg-white rounded-md p-4 space-y-4">
        <div className="flex justify-between gap-3 items-center">
          <Button onClick={() => navigate(-1)} size="sm">
            <ChevronLeft></ChevronLeft>
            <span>Back</span>
          </Button>
          <PageTitle>Edit Category</PageTitle>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            placeholder="Category name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Textarea
            value={form.description}
            description="description"
            placeholder="Category Description"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Button type="submit" disabled={isUpdating}>
            {isUpdating && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {isUpdating ? "Updating.." : "Update Category"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
