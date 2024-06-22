import axios from "axios";

export default function useAero() {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  async function searchFlights({ lat1, lon1, lat2, lon2 }) {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/aero/flights/search?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`
      );
      return response.data.flights;
    } catch (error) {
      console.error("Error searching flights", error);
      return [];
    }
  }

  async function searchFlightsPositions({ lat1, lon1, lat2, lon2 }) {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/aero/flights/search/positions?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`
      );
      return response.data.flights;
    } catch (error) {
      console.error("Error searching flights", error);
      return [];
    }
  }

  async function getFlightTrack(flightId) {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/aero/flights/${flightId}/track`
      );
      return response.data.positions;
    } catch (error) {
      console.error("Error searching flights", error);
      return [];
    }
  }

  return { searchFlights, getFlightTrack, searchFlightsPositions };
}
