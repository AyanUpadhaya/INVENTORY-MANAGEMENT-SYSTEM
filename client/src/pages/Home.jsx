import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center">
      <div className="p-6 bg-white rounded-md space-y-4 text-center">
        <h2 className="font-poppins font-medium text-2xl">
          Welocome to Inventory Management System
        </h2>
        <p className="font-poppins text-base text-gray-500">
          With AI Integration
        </p>
        <br />
        <Link
          className="px-4 py-2 rounded-md text-white bg-purple-800 font-poppins"
          to={"/login"}
        >
          Proceed Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
