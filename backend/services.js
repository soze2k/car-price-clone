const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/carprices', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const CarSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  description: String,
  odometer: Number,
  condition: String,
  location: String,
  saleCategory: String,
  saleDate: String,
  salePrice: String,
});

const Car = mongoose.model('Car', CarSchema);

// Helper function to get distinct values
const getDistinctValues = async (field, filter = {}) => {
  try {
    return await Car.distinct(field, filter);
  } catch (err) {
    throw err;
  }
};

// API endpoints for distinct values
const endpoints = [
  { path: '/api/options/makes', field: 'make' },
  { path: '/api/options/models', field: 'model', filter: 'make' },
  { path: '/api/options/years', field: 'year', filter: ['make', 'model'] },
  { path: '/api/options/conditions', field: 'condition', filter: ['make', 'model'] },
  { path: '/api/options/locations', field: 'location', filter: ['make', 'model'] },
  { path: '/api/options/saleCategories', field: 'saleCategory', filter: ['make', 'model'] }
];

endpoints.forEach(endpoint => {
  app.get(endpoint.path, async (req, res) => {
    try {
      let filter = {};
      if (endpoint.filter) {
        if (Array.isArray(endpoint.filter)) {
          endpoint.filter.forEach(key => {
            if (req.query[key]) {
              filter[key] = req.query[key];
            }
          });
        } else {
          filter[endpoint.filter] = req.query[endpoint.filter];
        }
      }
      const values = await getDistinctValues(endpoint.field, filter);
      res.json(values);
    } catch (err) {
      res.status(500).send(err);
    }
  });
});

// API to get cars with filters and sorting
app.get('/api/cars', async (req, res) => {
  try {
    console.log("Received filters:", req.query);

    const filters = {};
    if (req.query.make) {
      filters.make = req.query.make;
    }
    if (req.query.model) {
      filters.model = req.query.model;
    }
    if (req.query.year) {
      filters.year = parseInt(req.query.year, 10);
    }
    if (req.query.condition) {
      filters.condition = req.query.condition;
    }
    if (req.query.location) {
      filters.location = req.query.location;
    }
    if (req.query.saleCategory) {
      filters.saleCategory = req.query.saleCategory;
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const sortOption = req.query.sort || 'saleDate';
    const sortOrder = req.query.order === 'DESC' ? -1 : 1;

    console.log("Filters for query:", filters);

    const totalCars = await Car.find(filters);
    const totalRecords = totalCars.length;
    const totalKM = totalCars.reduce((sum, car) => sum + car.odometer, 0);
    const totalAge = totalCars.reduce((sum, car) => sum + (new Date().getFullYear() - car.year), 0);

    const cars = await Car.find(filters)
                          .sort({ [sortOption]: sortOrder })
                          .skip(skip)
                          .limit(limit);

    console.log("Queried cars:", cars);

    res.json({
      cars,
      totalRecords,
      totalKM,
      totalAge
    });
  } catch (err) {
    console.error('Error fetching cars:', err);
    res.status(500).send(err);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
