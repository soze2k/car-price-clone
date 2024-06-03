import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchOptions = (url, params = {}) => {
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(url, { params });
        setOptions(response.data);
      } catch (err) {
        setError(err);
        console.error(`Failed to fetch from ${url}`, err);
      }
    };
    fetchOptions();
  }, [url, params]);

  return { options, error };
};

export default useFetchOptions;
