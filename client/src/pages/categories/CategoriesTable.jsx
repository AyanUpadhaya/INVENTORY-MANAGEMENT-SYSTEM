import { useNavigate } from "react-router-dom";
import { useDeleteCategoryMutation } from "../../features/categories/categoriesApi";
import { formatDate } from "../../lib/dateFormats";
import { Trash2, Edit2, EyeIcon, Database } from "lucide-react";
import toast from "react-hot-toast";
import truncateText from "../../lib/truncateText";
import ReactPaginate from "react-paginate";
import { useState } from "react";

const CategoriesTable = ({ data }) => {
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();
  const navigate = useNavigate();
  const handleDelete = async (item) => {
    try {
      await deleteCategory(item?._id).unwrap();
      toast.success("Category deleted!");
    } catch (error) {
      toast.error(error?.data?.message ?? "Failed to delete category");
    }
  };
  const itemsPerPage = 6;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = data.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <table className="w-full rounded-md bg-white">
        <thead>
          <tr className="border border-gray-300 bg-gray-800 rounded-md">
            <th className="font-medium font-poppins text-sm text-white border border-gray-300">
              Name
            </th>
            <th className="font-medium font-poppins text-sm text-white border border-gray-300">
              Description
            </th>
            <th className="font-medium font-poppins text-sm text-white border border-gray-300">
              Created
            </th>
            <th className="font-medium font-poppins text-sm text-white border border-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr className="border border-gray-300" key={item?._id}>
              <td className="px-3 py-2 font-poppins text-sm border border-gray-300">
                {truncateText(item?.name)}
              </td>
              <td className="px-3 py-2 font-poppins text-sm border border-gray-300">
                {truncateText(item?.description, 35)}
              </td>
              <td className="px-3 py-2 font-poppins text-sm border border-gray-300 text-center">
                {formatDate(item?.createdAt)}
              </td>
              <td className="px-3 py-2 font-poppins text-sm  flex items-center justify-center gap-3">
                <button onClick={() => handleDelete(item)} disabled={isLoading}>
                  <Trash2 className="text-red-500"></Trash2>
                </button>
                <button
                  onClick={() =>
                    navigate(`/dashboard/edit-category/${item?._id}`)
                  }
                >
                  <Edit2 className="text-blue-500"></Edit2>
                </button>
                <button>
                  <EyeIcon className="text-green-500"></EyeIcon>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        breakLabel="..."
        nextLabel="Next ›"
        previousLabel="‹ Prev"
        onPageChange={handlePageClick}
        pageCount={pageCount}
        pageRangeDisplayed={5}
        containerClassName="flex justify-center items-center gap-2 my-auto"
        pageClassName="border border-gray-300 rounded-md hover:border-0"
        pageLinkClassName="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-md "
        previousClassName="border border-gray-300 rounded-md"
        previousLinkClassName="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
        nextClassName="border border-gray-300 rounded-md"
        nextLinkClassName="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
        activeClassName="bg-gray-800 border-gray-800 "
        activeLinkClassName="text-white"
        disabledClassName="opacity-50 cursor-not-allowed"
        breakClassName="px-3 py-1 text-gray-500"
      />
    </div>
  );
};

export default CategoriesTable;
