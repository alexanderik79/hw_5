import axios from 'axios';

const BASE_URL = 'https://694eda01b5bc648a93c1705e.mockapi.io';

export const fetchFlights = async (searchParams = {}) => {

  const params = new URLSearchParams();
  if (searchParams.origin) params.append('origin', searchParams.origin);
  if (searchParams.destination) params.append('destination', searchParams.destination);
  if (searchParams.departureDate) params.append('departureDate', searchParams.departureDate);

  const response = await axios.get(`${BASE_URL}/flights?${params.toString()}`);
  return response.data;
};