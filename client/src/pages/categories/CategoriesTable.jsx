import { useNavigate } from "react-router-dom";
import { useDeleteCategoryMutation } from "../../features/categories/categoriesApi";
import { formatDate } from "../../lib/dateFormats";
import { Trash2, Edit2, EyeIcon } from "lucide-react";
import toast from "react-hot-toast";
const CategoriesTable = ({ data }) => {
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();
  const navigate = useNavigate()
  const handleDelete = async (item) => {
    try {
      await deleteCategory(item?._id).unwrap();
      toast.success("Category deleted!");
    } catch (error) {
      toast.error(error?.data?.message ?? "Failed to delete category");
    }
  };
  return (
    <table className="w-full rounded-md">
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
        {data.map((item) => (
          <tr className="border border-gray-300" key={item?._id}>
            <td className="px-3 py-2 font-poppins text-sm border border-gray-300">
              {item?.name}
            </td>
            <td className="px-3 py-2 font-poppins text-sm border border-gray-300">
              {item?.description}
            </td>
            <td className="px-3 py-2 font-poppins text-sm border border-gray-300 text-center">
              {formatDate(item?.createdAt)}
            </td>
            <td className="px-3 py-2 font-poppins text-sm  flex items-center justify-center gap-3">
              <button onClick={() => handleDelete(item)} disabled={isLoading}>
                <Trash2 className="text-red-500"></Trash2>
              </button>
              <button onClick={()=>navigate(`/dashboard/edit-category/${item?._id}`)}>
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
  );
};

export default CategoriesTable;
