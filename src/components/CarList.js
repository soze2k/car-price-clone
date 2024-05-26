import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';

const CarList = ({ filters }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalKM, setTotalKM] = useState(0);
  const [totalAge, setTotalAge] = useState(0);
  const [sortOption, setSortOption] = useState('saleDate');
  const [sortOrder, setSortOrder] = useState('ASC');

  const fetchCars = async (reset = false) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/cars', {
        params: { ...filters, page, limit: 10, sort: sortOption, order: sortOrder }
      });

      if (response.data.cars.length === 0) {
        setHasMore(false);
        if (reset) setCars([]);
      } else {
        setCars(prevCars => reset ? response.data.cars : [...prevCars, ...response.data.cars]);
        if (response.data.cars.length < 10) {
          setHasMore(false);
        }
      }

      setTotalRecords(response.data.totalRecords);
      setTotalKM(response.data.totalKM);
      setTotalAge(response.data.totalAge);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars(true);
    setPage(1);
    setHasMore(true);
  }, [filters, sortOption, sortOrder]);

  useEffect(() => {
    if (page > 1) {
      fetchCars();
    }
  }, [page]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const toggleSortOrder = (order) => {
    setSortOrder(order);
  };

  if (error) return <div>Error loading cars: {error.message}</div>;

  return (
    <div>
      <div className='vehicle-summary'>
        <span className='vehicle-summary-front'>Records: {totalRecords}</span>
        <span className='vehicle-summary-front'>Average KM: {totalRecords > 0 ? (totalKM / totalRecords).toFixed(0) : 0}</span>
        <span className='vehicle-summary-front'>Average age: {totalRecords > 0 ? (totalAge / totalRecords).toFixed(1) : 0} yrs</span>
      </div>
      <div className='sort-container'>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="saleDate">Sort by Sale Date</option>
          <option value="year">Sort by Age</option>
          <option value="odometer">Sort by Odometer</option>
        </select>
        <button className={sortOrder === 'ASC' ? 'active' : ''} onClick={() => toggleSortOrder('ASC')}>ASC</button>
        <button className={sortOrder === 'DESC' ? 'active' : ''} onClick={() => toggleSortOrder('DESC')}>DESC</button>
      </div>
      <div className='table-background'>
        <table className='vehicle-table'>
          <thead>
            <tr>
              <th>Make</th>
              <th>Model</th>
              <th>Year</th>
              <th>Description</th>
              <th>Odometer (km)</th>
              <th>Vehicle condition</th>
              <th>Sale location</th>
              <th>Sale category</th>
              <th>Sale date</th>
              <th>Sale price</th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 && !loading ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center' }}>No results found</td>
              </tr>
            ) : (
              cars.map(car => (
                <tr className='vehicle-info' key={car._id}>
                  <td data-label="Make">{car.make}</td>
                  <td data-label="Model">{car.model}</td>
                  <td data-label="Year">{car.year}</td>
                  <td data-label="Description">{car.description}</td>
                  <td data-label="Odometer (km)">{car.odometer}</td>
                  <td data-label="Vehicle condition">{car.condition}</td>
                  <td data-label="Sale location">{car.location}</td>
                  <td data-label="Sale category">{car.saleCategory}</td>
                  <td data-label="Sale date">{car.saleDate}</td>
                  <td data-label="Sale price">
                    <button className='subscribe-button'>Subscribe to reveal price</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {loading && <div>Loading...</div>}
        {hasMore && !loading && cars.length >= 10 && (
          <div className='button-container'>
            <button className='load-button' onClick={loadMore}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarList;
