import * as React from 'react';
import axios from 'axios';
import { Image } from 'react-native';
import { RoverRequestResult } from './types';

const API_KEY = 'HUELHT66Wk1iwDTcvnlrdayW7GEhCqTpdjis394J';

export const useRoverImages = () => {
  const [initialize, setInitialize] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<RoverRequestResult | undefined>();

  const load = React.useCallback(async (page: number = 1) => {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${API_KEY}&page=${page}`;
    const response = await axios.get<RoverRequestResult>(url);
    const data = response.data;

    if (data) {
      const images = data.photos.map((item) => {
        return Image.prefetch(item.img_src);
      });

      await Promise.all([...images]);
    }
    
    setPage(page);
    setData((existing) => ({
      photos: [...existing?.photos || [], ...data.photos]
    }));
  }, []);

  const loadMore = React.useCallback(async () => {
    setLoadingMore(true);
    await load(page + 1);
    setLoadingMore(false);
  }, [page]);

  React.useEffect(() => {
    const startLoadingData = async () => {
      setLoading(true);

      await load();

      setLoading(false);
      setInitialize(true);
    }

    !initialize && startLoadingData();
  }, [initialize, load]);

  return { load, data, loading, loadMore, loadingMore };
};