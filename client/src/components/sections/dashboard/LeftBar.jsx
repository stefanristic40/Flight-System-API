import React from "react";
import MapInput from "./MapInput";
import FlightList from "./FlightList";

function LeftBar() {
  return (
    <div className="border-r-2 border-layoutBorder w-[400px] py-6 px-3 shadow-lg">
      <div>
        <h1 className="text-center font-bold text-2xl">Plane Map</h1>
        <MapInput />
      </div>
      <div>
        <FlightList />
      </div>
    </div>
  );
}

export default LeftBar;
