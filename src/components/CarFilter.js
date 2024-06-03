import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';

const CarFilter = ({ filters, setFilters }) => {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [saleCategories, setSaleCategories] = useState([]);
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/options/makes');
        setMakes(response.data);
      } catch (err) {
        console.error('Failed to fetch makes', err);
      }
    };
    fetchMakes();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (tempFilters.make) {
        try {
          const response = await axios.get('http://localhost:5000/api/options/models', {
            params: { make: tempFilters.make },
          });
          setModels(response.data);
        } catch (err) {
          console.error('Failed to fetch models', err);
        }
      }
    };
    fetchModels();
  }, [tempFilters.make]);

  useEffect(() => {
    const fetchYears = async () => {
      if (tempFilters.make && tempFilters.model) {
        try {
          const response = await axios.get('http://localhost:5000/api/options/years', {
            params: { make: tempFilters.make, model: tempFilters.model },
          });
          setYears(response.data);
        } catch (err) {
          console.error('Failed to fetch years', err);
        }
      }
    };
    fetchYears();
  }, [tempFilters.make, tempFilters.model]);

  useEffect(() => {
    const fetchConditions = async () => {
      if (tempFilters.make && tempFilters.model) {
        try {
          const response = await axios.get('http://localhost:5000/api/options/conditions', {
            params: { make: tempFilters.make, model: tempFilters.model },
          });
          setConditions(response.data);
        } catch (err) {
          console.error('Failed to fetch conditions', err);
        }
      }
    };
    fetchConditions();
  }, [tempFilters.make, tempFilters.model]);

  useEffect(() => {
    const fetchLocations = async () => {
      if (tempFilters.make && tempFilters.model) {
        try {
          const response = await axios.get('http://localhost:5000/api/options/locations', {
            params: { make: tempFilters.make, model: tempFilters.model },
          });
          setLocations(response.data);
        } catch (err) {
          console.error('Failed to fetch locations', err);
        }
      }
    };
    fetchLocations();
  }, [tempFilters.make, tempFilters.model]);

  useEffect(() => {
    const fetchSaleCategories = async () => {
      if (tempFilters.make && tempFilters.model) {
        try {
          const response = await axios.get('http://localhost:5000/api/options/saleCategories', {
            params: { make: tempFilters.make, model: tempFilters.model },
          });
          setSaleCategories(response.data);
        } catch (err) {
          console.error('Failed to fetch saleCategories', err);
        }
      }
    };
    fetchSaleCategories();
  }, [tempFilters.make, tempFilters.model]);

  const handleMakeChange = (e) => {
    setTempFilters({ ...tempFilters, make: e.target.value, model: '', year: '', condition: '', location: '', saleCategory: '' });
    setModels([]);
    setYears([]);
    setConditions([]);
    setLocations([]);
    setSaleCategories([]);
  };

  const handleModelChange = (e) => {
    setTempFilters({ ...tempFilters, model: e.target.value, year: '', condition: '', location: '', saleCategory: '' });
    setYears([]);
    setConditions([]);
    setLocations([]);
    setSaleCategories([]);
  };

  const handleYearChange = (e) => {
    setTempFilters({ ...tempFilters, year: e.target.value });
  };

  const handleConditionChange = (e) => {
    setTempFilters({ ...tempFilters, condition: e.target.value });
  };

  const handleLocationChange = (e) => {
    setTempFilters({ ...tempFilters, location: e.target.value });
  };

  const handleSaleCategoryChange = (e) => {
    setTempFilters({ ...tempFilters, saleCategory: e.target.value });
  };

  return (
    <div className='filters-wrapper'>
      <div className='new-filters-wrapper'>
        <div className='filters-container'>
          <div className='filters-options'>
            <select className='filter-dropdown' value={tempFilters.make} onChange={handleMakeChange}>
              <option value="">Select Make</option>
              {makes.map((make, index) => (
                <option key={index} value={make}>
                  {make}
                </option>
              ))}
            </select>
            <select className='filter-dropdown' value={tempFilters.model} onChange={handleModelChange} disabled={!tempFilters.make}>
              <option value="">Select Model</option>
              {models.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <select className='filter-dropdown' value={tempFilters.year} onChange={handleYearChange} disabled={!tempFilters.model}>
              <option value="">Select Year</option>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select className='filter-dropdown' value={tempFilters.condition} onChange={handleConditionChange} disabled={!tempFilters.model}>
              <option value="">Select Condition</option>
              {conditions.map((condition, index) => (
                <option key={index} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
            <select className='filter-dropdown' value={tempFilters.location} onChange={handleLocationChange} disabled={!tempFilters.model}>
              <option value="">Select Location</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <select className='filter-dropdown' value={tempFilters.saleCategory} onChange={handleSaleCategoryChange} disabled={!tempFilters.model}>
              <option value="">Select Sale Category</option>
              {saleCategories.map((saleCategory, index) => (
                <option key={index} value={saleCategory}>
                  {saleCategory}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='filters-actions'>
          <button className='filter-apply-button' onClick={() => setFilters(tempFilters)}>Apply</button>
          <button className='filter-clear-button' onClick={() => {
            setTempFilters({
              make: '',
              model: '',
              year: '',
              condition: '',
              location: '',
              saleCategory: ''
            });
            setFilters({
              make: '',
              model: '',
              year: '',
              condition: '',
              location: '',
              saleCategory: ''
            });
          }}>Clear</button>
        </div>
      </div>
    </div>
  );
};

export default CarFilter;
