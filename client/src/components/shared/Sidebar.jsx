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
    name: "Inventory",
    url: "/dashboard/inventory",
    submenu: [],
    pathMap: ["/dashboard/inventory"],
    icon: ChartBar,
    roles: ["admin", "staff", "manager"],
  },
  {
    id: 3,
    name: "Users",
    url: "/dashboard/users",
    submenu: [],
    pathMap: ["/dashboard/users"],
    icon: UserRoundSearch,
    roles: ["admin"],
  },
  {
    id: 4,
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
    id: 5,
    name: "Orders",
    url: "orders",
    pathMap: [
      "/dashboard/orders",
      "/dashboard/add-order",
      "/dashboard/update-order",
    ],
    submenu: [
      {
        name: "Add Order",
        url: "/dashboard/add-order",
      },
      {
        name: "Update Order",
        url: "/dashboard/update-order",
      },
    ],
    icon: Logs,
    roles: ["viewer", "staff", "manager", "admin"],
  },
  {
    id: 6,
    name: "Settings",
    url: "/dashboard/settings",
    submenu: [],
    pathMap: ["/settings"],
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
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div
      className={`${
        showSidebar ? "w-72 px-4" : "w-0"
      }  bg-gray-900 h-full  relative duration-300 no-scrollbar overflow-auto `}
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
      <div className="space-y-4">
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
              <ul
                className={`flex flex-col gap-1 duration-300 pl-10`}
                style={{ maxHeight: isSubmenuOpen[item?.name] ? `320px` : "0" }}
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
