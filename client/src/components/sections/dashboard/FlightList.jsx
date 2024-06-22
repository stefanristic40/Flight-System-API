import React, { useEffect, useState } from "react";
import useMapStore from "../../../hooks/useMapStore";
import { Airplane } from "@phosphor-icons/react";
import CountUp from "react-countup";

function FlightList() {
  const flights = useMapStore((state) => state.flights);
  const setSelectedFlight = useMapStore((state) => state.setSelectedFlight);
  const selectedFlight = useMapStore((state) => state.selectedFlight);

  const [oldFlightsCount, setOldFlightsCount] = useState(0);
  const [newFlightsCount, setNewFlightsCount] = useState(0);
  useEffect(() => {
    setOldFlightsCount(newFlightsCount);
    setNewFlightsCount(flights.length);
  }, [flights]);

  if (!flights || (flights && flights.length === 0)) {
    return null;
  }

  return (
    <div className="mt-5 rounded-md h-full">
      <p>
        Found{" "}
        <CountUp end={flights.length} start={oldFlightsCount} duration={3} />{" "}
        flights in the area.
      </p>
      <div className="h-full max-h-[400px] overflow-auto custom-scrollbar ">
        {flights.map((flight, index) => (
          <div
            key={index}
            className={`border-b-2 border-gray-200 px-2 py-2 flex justify-start items-center gap-4 cursor-pointer  transition-all ease-in-out
              ${
                selectedFlight?.ident === flight.ident
                  ? "bg-[#F8C023] text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }
            `}
            onClick={() => setSelectedFlight(flight)}
          >
            <Airplane
              className={`h-6 w-6  ${
                selectedFlight?.ident === flight.ident
                  ? "text-white"
                  : "text-[#F8C023]"
              } `}
            />
            <div>
              <p className="font-medium text-sm ">{flight?.ident}</p>
              <p className="text-xs">{flight?.aircraft_type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlightList;
