import * as React from 'react';
import axios from 'axios';
import { Image } from 'react-native';

const API_KEY = 'HUELHT66Wk1iwDTcvnlrdayW7GEhCqTpdjis394J';

export type Rover = {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
};

export type RoverCamera = {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
};

export type RoverPhoto = {
  id: number;
  sol: number;
  camera: RoverCamera;
  img_src: string;
  earth_date: string;
  rover: Rover;
};

export type RoverRequestResult = {
  photos: RoverPhoto[];
};

export const useRoverImages = () => {
  const [initialize, setInitialize] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<RoverRequestResult | undefined>();

  const load = React.useCallback(async (page: number = 1) => {
    setLoading(true);

    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${API_KEY}&page=${page}`;
    const response = await axios.get<RoverRequestResult>(url);
    const data = response.data || [];

    const images = data.photos.map((item) => {
      return Image.prefetch(item.img_src);
    });

    await Promise.all([...images]);
    
    setLoading(false);
    setData(data);
  }, []);

  React.useEffect(() => {
    if (!initialize) {
      load();
      setInitialize(true);
    }
  }, [initialize, load]);

  return { load, data, loading };
};