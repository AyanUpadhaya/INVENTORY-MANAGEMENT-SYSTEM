import PageTitle from "../../components/shared/PageTitle";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import CategoriesTable from "./CategoriesTable";
import NoDataFound from "../../components/shared/NoDataFound";
import Input from "../../components/ui/Input";
import { Upload } from "lucide-react";
import { useState } from "react";

const Categories = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [search, setSearch] = useState("");

  const filteredCategories =
    categories &&
    [...categories].filter((item) => {
      if (search) {
        return item?.name?.toLowerCase().startsWith(search.trim().toLowerCase())
      } else {
        return item;
      }
    });

  if (isLoading)
    return (
      <div className="p-4">
        <h2 className="font-medium text-2xl">Loading...</h2>
      </div>
    );
  const content =
    filteredCategories.length > 0 ? (
      <CategoriesTable data={filteredCategories}></CategoriesTable>
    ) : (
      <NoDataFound message={"No categories found.."} />
    );
  return (
    <div className="p-4 h-full">
      <div className="flex justify-between gap-2 flex-wrap">
        <PageTitle>Categories</PageTitle>
        <Button onClick={() => navigate("/dashboard/add-category")}>
          {" "}
          + Add Category
        </Button>
      </div>
      <div className="mt-4 p-6 bg-white rounded-md">
        <div className="mb-4 flex justify-between gap-3">
          <Input
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category"
            className={"max-w-lg"}
          ></Input>
          <label
            htmlFor="uploadFile"
            className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            <Upload></Upload>
            <span>Upload Categories</span>
          </label>
          <input className="hidden" type="file" id="uploadFile" />
        </div>
        {content}
      </div>
    </div>
  );
};

export default Categories;
