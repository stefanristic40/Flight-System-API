import React from "react";

import { AirplaneTakeoff, Gps, Speedometer } from "@phosphor-icons/react";

function FlightDetailModal({ isOpen, setIsOpen, flight }) {
  if (!isOpen) return null;

  return (
    <div>
      <div className="fixed top-6 right-6  w-[360px] border bg-white ">
        <div className="bg-[#303030] flex justify-between items-center py-2 px-4">
          <div>
            <p className="text-[#F8C023] font-medium text-lg">
              {flight?.ident}{" "}
            </p>
            <p className="text-white text-sm">{flight?.aircraft_type}</p>
          </div>
          <button
            className="text-white font-bold "
            onClick={() => setIsOpen(false)}
          >
            &#10005;
          </button>
        </div>
        <div className="flex justify-between items-center bg-[#EDEDED]">
          <div className="w-full text-center py-4">
            <p className="text-2xl font-bold">{flight?.origin?.code}</p>
            <p className="text-base font-medium">{flight?.origin?.city}</p>
          </div>
          <div>
            <div className="w-14 h-14 flex justify-center items-center bg-white rounded-full overflow-hidden ">
              <AirplaneTakeoff
                size={32}
                weight="fill"
                className="text-[#F8C023]"
              />
            </div>
          </div>
          <div className="w-full text-center py-4">
            <p className="text-2xl font-bold">{flight?.destination?.code}</p>
            <p className="text-base font-medium">{flight?.destination?.city}</p>
          </div>
        </div>
        <div>
          {/* Start Time and Groundspeed */}
          <div className="flex flex-col py-2 px-4 gap-2">
            <div className="w-full flex justify-between items-center gap-10">
              <div className="flex items-center gap-2">
                <Gps size={24} />
                <p className="font-medium ">Latitude</p>
              </div>
              <p className="font-medium text-nowrap ">
                {flight?.last_position.latitude}
              </p>
            </div>
            <div className="w-full flex justify-between items-center gap-10">
              <div className="flex items-center gap-2">
                <Gps size={24} />
                <p className="font-medium ">Longitude</p>
              </div>
              <p className="font-medium text-nowrap ">
                {flight?.last_position.longitude}
              </p>
            </div>
            <div className="w-full flex justify-between items-center gap-10">
              <div className="flex items-center gap-2">
                <Gps size={24} />
                <p className="font-medium ">Altitude</p>
              </div>
              <p className="font-medium text-nowrap ">
                {flight?.last_position.altitude}
              </p>
            </div>
            <div className="w-full flex justify-between items-center gap-10">
              <div className="flex items-center gap-2">
                <Speedometer size={24} />
                <p className="font-medium ">Groundspeed</p>
              </div>
              <p className="font-medium text-nowrap ">
                {flight?.last_position.groundspeed} mph
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightDetailModal;
