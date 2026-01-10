import PageTitle from "../components/shared/PageTitle";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../features/products/productApi";

const Products = () => {
  const { data: products } = useGetProductsQuery();

  const [deleteProduct] = useDeleteProductMutation();

  const content = (
    <div className="p-4">
      <PageTitle>Products</PageTitle>
      <ul>
        {products?.map((p) => (
          <li
            key={p._id}
            style={{
              padding: "10px",
              marginBottom: "8px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <b>{p.name}</b> — ${p.price}
            </span>
            <small style={{ opacity: 0.6 }}>
              by {p?.createdBy?.name || "Unknown"}
            </small>
            <button
              onClick={() => deleteProduct(p._id)}
              style={{ marginLeft: 10, color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return content;
};

export default Products;
