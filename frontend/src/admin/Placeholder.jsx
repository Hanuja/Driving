import React from 'react';

const Placeholder = ({ title }) => {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 mt-2">This page is under construction.</p>
      </div>
    </div>
  );
};

export default Placeholder;
