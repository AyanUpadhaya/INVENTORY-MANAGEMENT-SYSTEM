import PageTitle from "../../components/shared/PageTitle";
import {
  useGetCategoriesQuery,
  useBulkUploadMutation,
} from "../../features/categories/categoriesApi";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import CategoriesTable from "./CategoriesTable";
import NoDataFound from "../../components/shared/NoDataFound";
import Input from "../../components/ui/Input";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import LoaderModal from "../../components/shared/LoaderModal";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "../../components/shared/Modal";
import { formatDate } from "../../lib/dateFormats";

const Categories = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [bulkUpload, { isLoading: isUploading }] = useBulkUploadMutation();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const uploadRef = useRef();

  const buklUploadHandler = ({
    event,
    ref,
    handler,
    infoMessage = "Categories Uploaded successfully",
    errorMessage = "Something went wrong",
  }) => {
    const file = event.target.files?.[0];

    if (!file || !file.name.endsWith(".csv")) {
      toast.error("Invalid CSV file");
      ref.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    handler(formData)
      .unwrap()
      .then((res) => {
        toast.success(res?.message || infoMessage);
      })
      .catch((error) => {
        toast.error(error?.data?.message || errorMessage);
      })
      .finally(() => {
        ref.current.value = "";
      });
  };

  const handelOpenModal = (category) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const filteredCategories =
    categories &&
    [...categories].filter((item) => {
      if (search) {
        return item?.name
          ?.toLowerCase()
          .startsWith(search.trim().toLowerCase());
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
      <CategoriesTable
        handelOpenModal={handelOpenModal}
        data={filteredCategories}
      ></CategoriesTable>
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
            htmlFor="fileupload"
            className="h-10 px-4 py-2  bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            <Upload className="cursor-pointer"></Upload>
            <span className="cursor-pointer">Upload Categories</span>

            <input
              type="file"
              id="fileupload"
              ref={uploadRef}
              accept=".csv"
              onChange={(event) =>
                buklUploadHandler({
                  event,
                  ref: uploadRef,
                  handler: bulkUpload,
                })
              }
              className="w-05 h-05 absolute opacity-0"
            />
          </label>
          <input className="hidden" type="file" id="uploadFile" />
        </div>
        {content}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} size="lg">
        <ModalHeader>{selectedCategory?.name}</ModalHeader>

        <ModalBody>
          <p className="text-sm text-gray-600">
            {selectedCategory?.description}
          </p>
          <p className="text-sm text-gray-600">
            Created at : {formatDate(selectedCategory?.createdAt)}
          </p>
        </ModalBody>

        <ModalFooter onClose={() => setOpen(false)}></ModalFooter>
      </Modal>
      <LoaderModal isOpen={isUploading}></LoaderModal>
    </div>
  );
};

export default Categories;
