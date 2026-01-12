import React from "react";

const NoDataFound = ({ message}) => {
  return (
    <div className="p-4 text-center">
      <h2 className="font-medium text-xl">{message}</h2>
    </div>
  );
};

export default NoDataFound;
