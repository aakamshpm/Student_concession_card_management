import React from "react";

const StudentRoutesField = ({ i, routes, onChangeHandler }) => {
  return (
    <div className="input-fields flex items-center gap-5 mt-2 p-4">
      <div className="flex flex-col justify-center">
        <p className="text-lg">Starting Point</p>
        <input
          name="startingPoint"
          value={routes[i].startingPoint}
          onChange={(e) => onChangeHandler(i, e)}
          className="w-[25em]"
          type="text"
          placeholder="Place 1"
        />
      </div>
      <p className="text-lg mt-8">to</p>
      <div>
        <p className="text-lg">Destination</p>
        <input
          name="destination"
          value={routes[i].destination}
          onChange={(e) => onChangeHandler(i, e)}
          className="w-[25em]"
          type="text"
          placeholder="Place 2"
        />
      </div>
    </div>
  );
};

export default StudentRoutesField;
