import React, { useState } from "react";
import {
  ChartBar,
  LayoutDashboard,
  Logs,
  Settings,
  ShoppingCart,
  UserRoundSearch,
  ChevronDown,
  ChevronUp,
  Tags,
  Truck,
  Building2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProfileQuery } from "../../features/auth/authApi";
import useGetPath from "../../hooks/useGetPath";

const SidebarLinks = [
  {
    id: 1,
    name: "Dashboard",
    url: "/dashboard",
    submenu: [],
    pathMap: ["/dashboard"],
    icon: LayoutDashboard,
    roles: ["viewer", "staff", "manager", "admin"],
  },
  {
    id: 2,
    name: "Products",
    url: "/dashboard/products",
    pathMap: [
      "/dashboard/products",
      "/dashboard/add-product",
      "/dashboard/update-product",
    ],
    submenu: [
      {
        name: "Products",
        url: "/dashboard/products",
      },
      {
        name: "Add Product",
        url: "/dashboard/add-product",
      },
    ],
    icon: ShoppingCart,
    roles: ["viewer", "staff", "manager", "admin"],
  },
  {
    id: 3,
    name: "Orders",
    url: "orders",
    pathMap: ["/dashboard/customer-orders", "/dashboard/purchase-orders"],
    submenu: [
      {
        name: "Customer Orders",
        url: "/dashboard/customer-orders",
      },
      {
        name: "Purchase Orders",
        url: "/dashboard/purchase-orders",
      },
    ],
    icon: Logs,
    roles: ["viewer", "staff", "manager", "admin"],
  },
  {
    id: 4,
    name: "Inventory",
    url: "/dashboard/inventory",
    submenu: [],
    pathMap: ["/dashboard/inventory"],
    icon: ChartBar,
    roles: ["admin", "staff", "manager"],
  },
  {
    id: 5,
    name: "Categories",
    url: "/dashboard/categories",
    submenu: [],
    pathMap: ["/dashboard/categories"],
    icon: Tags,
    roles: ["admin", "staff", "manager"],
  },
  {
    id: 6,
    name: "Suppliers",
    url: "/dashboard/suppliers",
    submenu: [],
    pathMap: ["/dashboard/suppliers"],
    icon: Truck,
    roles: ["admin", "staff", "manager"],
  },
  {
    id: 7,
    name: "Warehouses",
    url: "/dashboard/warehouses",
    submenu: [],
    pathMap: ["/dashboard/warehouses"],
    icon: Building2,
    roles: ["admin", "staff", "manager"],
  },
  {
    id: 8,
    name: "Customers",
    url: "/dashboard/customers",
    submenu: [],
    pathMap: ["/dashboard/customers"],
    icon: Users,
    roles: ["admin", "staff", "manager"],
  },
  {
    id: 9,
    name: "Users",
    url: "/dashboard/users",
    submenu: [],
    pathMap: ["/dashboard/users"],
    icon: UserRoundSearch,
    roles: ["admin"],
  },
  {
    id: 10,
    name: "Settings",
    url: "/dashboard/settings",
    submenu: [],
    pathMap: ["/dashboard/settings"],
    icon: Settings,
    roles: ["manager", "admin"],
  },
];

const Sidebar = ({ showSidebar }) => {
  const { data: user } = useProfileQuery();
  const role = user?.role ?? "staff";
  const { isPathActive, currentPath } = useGetPath();
  const filteredLinks =
    SidebarLinks.filter((item) => item.roles.includes(role)) ?? [];

  const [isSubmenuOpen, setIsSubmenuOpen] = useState({
    Products: false,
    Orders: false,
  });

  const handleDropdown = (menu) => {
    setIsSubmenuOpen((prev) => ({
      [menu]: !prev[menu],
    }));
  };

  return (
    <div
      className={`${
        showSidebar ? "w-72 px-4" : "w-0"
      }  bg-gray-900 h-full pb-5  relative duration-300 no-scrollbar overflow-auto `}
    >
      {/* logo */}
      <div className="h-12 mb-6 py-3">
        <Link
          to={"/dashboard"}
          className="flex items-center gap-3 text-white text-xl"
        >
          <ChartBar className="w-5 h-5" />
          <span>InventoryPro</span>
        </Link>
      </div>
      {/* rest of the sidebar */}
      <div className="space-y-3">
        {filteredLinks.map((item) => {
          const active = isPathActive(item.pathMap);
          const Icon = item.icon;
          const hasSubmenu = item?.submenu?.length > 0;
          const component = !hasSubmenu ? (
            <Link
              className={`${
                active ? "bg-blue-500" : ""
              }  p-2 rounded hover:bg-gray-700  flex gap-2 items-center font-medium text-white`}
              to={item?.url}
              key={item.id}
            >
              <span>
                <Icon className="w-4 h-4"></Icon>
              </span>
              <span>{item.name}</span>
            </Link>
          ) : (
            <div className="overflow-hidden">
              <div
                className={`${
                  active ? "bg-blue-500" : ""
                }  p-2 rounded hover:bg-gray-700 flex items-center justify-between font-medium text-white cursor-pointer`}
                key={item.id}
                onClick={() => handleDropdown(item?.name)}
              >
                {/* name and icon */}
                <div className="flex gap-2 items-center">
                  <span>
                    <Icon className="w-4 h-4"></Icon>
                  </span>
                  <span>{item.name}</span>
                </div>
                {/* cheverons */}
                {!isSubmenuOpen[item?.name] ? (
                  <ChevronDown className="w-4 h-4"></ChevronDown>
                ) : (
                  <ChevronUp className="w-4 h-4"></ChevronUp>
                )}
              </div>
              {/* submenus */}
              <ul
                className={`flex flex-col gap-1 duration-300 pl-10`}
                style={{
                  maxHeight: isSubmenuOpen[item?.name] ? `320px` : "0",
                  paddingTop: isSubmenuOpen[item?.name] ? "12px" : "0",
                }}
              >
                {item?.submenu.map((submenu, idx) => (
                  <>
                    <Link
                      className={`${
                        currentPath == submenu?.url
                          ? "text-blue-500"
                          : "text-white"
                      }  p-2 rounded hover:bg-gray-700  flex gap-2 items-center font-medium `}
                      to={submenu?.url}
                      key={idx}
                    >
                      <span>{submenu.name}</span>
                    </Link>
                  </>
                ))}
              </ul>
            </div>
          );
          return component;
        })}
      </div>
    </div>
  );
};

export default Sidebar;
