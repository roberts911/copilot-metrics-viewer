// TypeScript
import axios from "axios";
import { Seat } from "../model/Seat";
import config from '../config';

import organizationMockedResponse_seats from '../assets/organization_response_sample_seats.json';
import enterpriseMockedResponse_seats from '../assets/enterprise_response_sample_seats.json';

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(config.github.token ? { Authorization: `token ${config.github.token}` } : {})
};

export const getSeatsApi = async (): Promise<Seat[]> => {
  const perPage = 50;
  let page = 1;
  let seatsData: Seat[] = [];

  let response;
  if (config.scope.type !== "organization") {
    // when the scope is not organization, return seatsData,by default it will return empty array
    return seatsData;
  }
  else {
    if (config.mockedData) {
      response = organizationMockedResponse_seats;
      seatsData = seatsData.concat(response.seats.map((item: any) => new Seat(item)));
    } 
    else {
    // Fetch the first page to get the total number of seats
      response = await axios.get(`${config.github.apiUrl}/copilot/billing/seats`, {
        headers,
        params: {
          per_page: perPage,
          page: page
        }
      });

      seatsData = seatsData.concat(response.data.seats.map((item: any) => new Seat(item)));
      // Calculate the total pages
      const totalSeats = response.data.total_seats;
      const totalPages = Math.ceil(totalSeats / perPage);

      // Fetch the remaining pages
      for (page = 2; page <= totalPages; page++) {
        response = await axios.get(`${config.github.apiUrl}/copilot/billing/seats`, {
          headers,
          params: {
            per_page: perPage,
            page: page
          }
        });

        seatsData = seatsData.concat(response.data.seats.map((item: any) => new Seat(item)));
      }
    }
    return seatsData;
  }
}