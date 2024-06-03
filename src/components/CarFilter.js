import React, { useState, useEffect } from 'react';
import useFetchOptions from './useFetchOptions';
import '../styles/styles.css';

const CarFilter = ({ filters, setFilters }) => {
  const [tempFilters, setTempFilters] = useState(filters);

  const { options: makes } = useFetchOptions('http://localhost:5000/api/options/makes');
  const { options: models } = useFetchOptions('http://localhost:5000/api/options/models', { make: tempFilters.make });
  const { options: years } = useFetchOptions('http://localhost:5000/api/options/years', { make: tempFilters.make, model: tempFilters.model });
  const { options: conditions } = useFetchOptions('http://localhost:5000/api/options/conditions', { make: tempFilters.make, model: tempFilters.model });
  const { options: locations } = useFetchOptions('http://localhost:5000/api/options/locations', { make: tempFilters.make, model: tempFilters.model });
  const { options: saleCategories } = useFetchOptions('http://localhost:5000/api/options/saleCategories', { make: tempFilters.make, model: tempFilters.model });

  const handleChange = (field, value) => {
    setTempFilters(prevFilters => ({
      ...prevFilters,
      [field]: value,
      ...(field === 'make' && { model: '', year: '', condition: '', location: '', saleCategory: '' }),
      ...(field === 'model' && { year: '', condition: '', location: '', saleCategory: '' })
    }));
  };

  const clearFilters = () => {
    const emptyFilters = {
      make: '',
      model: '',
      year: '',
      condition: '',
      location: '',
      saleCategory: ''
    };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
  };

  return (
    <div className='filters-wrapper'>
      <div className='new-filters-wrapper'>
        <div className='filters-container'>
          <div className='filters-options'>
            <select className='filter-dropdown' value={tempFilters.make} onChange={e => handleChange('make', e.target.value)}>
              <option value="">Select Make</option>
              {makes.map((make, index) => (
                <option key={index} value={make}>
                  {make}
                </option>
              ))}
            </select>
            <select className='filter-dropdown' value={tempFilters.model} onChange={e => handleChange('model', e.target.value)} disabled={!tempFilters.make}>
              <option value="">Select Model</option>
              {models.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <select className='filter-dropdown' value={tempFilters.year} onChange={e => handleChange('year', e.target.value)} disabled={!tempFilters.model}>
              <option value="">Select Year</option>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select className='filter-dropdown' value={tempFilters.condition} onChange={e => handleChange('condition', e.target.value)} disabled={!tempFilters.model}>
              <option value="">Select Condition</option>
              {conditions.map((condition, index) => (
                <option key={index} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
            <select className='filter-dropdown' value={tempFilters.location} onChange={e => handleChange('location', e.target.value)} disabled={!tempFilters.model}>
              <option value="">Select Location</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <select className='filter-dropdown' value={tempFilters.saleCategory} onChange={e => handleChange('saleCategory', e.target.value)} disabled={!tempFilters.model}>
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
          <button className='filter-clear-button' onClick={clearFilters}>Clear</button>
        </div>
      </div>
    </div>
  );
};

export default CarFilter;
