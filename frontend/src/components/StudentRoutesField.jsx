import React from "react";

const StudentRoutesField = ({ index, routes, onChangeHandler, onRemove }) => {
  return (
    <div className="route-field p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Route {index + 1}</h3>
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Starting Point
          </label>
          <input
            type="text"
            name="startingPoint"
            value={routes[index].startingPoint}
            onChange={(e) => onChangeHandler(index, e)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-color focus:border-primary-color"
            placeholder="Enter starting location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <input
            type="text"
            name="destination"
            value={routes[index].destination}
            onChange={(e) => onChangeHandler(index, e)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-color focus:border-primary-color"
            placeholder="Enter destination"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentRoutesField;
