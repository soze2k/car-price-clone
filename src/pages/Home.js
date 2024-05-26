import React, { useState } from 'react';
import CarList from '../components/CarList';
import CarFilter from '../components/CarFilter';
import '../styles/styles.css';

// Home component which contains the filter and list of cars
const Home = () => {
  // State to manage filter criteria
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    condition: '',
    location: '',
    saleCategory: '',
  });

  return (
    <div>
      <div className="site-header">
        <div className='site-header__wrapper wrapper'>
          <div className='.site-header__wrapper .site-header__leftArea'>
            <img alt='logo' width={232} src='https://pricespeoplepay.com.au/assets/images/ppp-logo.webp'></img>
          </div>
        </div>
      </div>

        <div className='wrapper'>
          <div>
            <h1 className='text-high-dark'>Used Car Sales for {filters.make} {filters.model}</h1>
          </div>
          <CarFilter filters={filters} setFilters={setFilters} />
        </div>

        <div>
            <CarList filters={filters} />
        </div>

    </div>
  );
};

export default Home;
