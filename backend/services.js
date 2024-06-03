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

// Define distinct options endpoints
const createEndpoint = (path, field, filterFields = []) => {
  app.get(path, async (req, res) => {
    try {
      let filter = {};
      filterFields.forEach(key => {
        if (req.query[key]) {
          filter[key] = req.query[key];
        }
      });
      const values = await getDistinctValues(field, filter);
      res.json(values);
    } catch (err) {
      res.status(500).send(err);
    }
  });
};

// Create endpoints
createEndpoint('/api/options/makes', 'make');
createEndpoint('/api/options/models', 'model', ['make']);
createEndpoint('/api/options/years', 'year', ['make', 'model']);
createEndpoint('/api/options/conditions', 'condition', ['make', 'model']);
createEndpoint('/api/options/locations', 'location', ['make', 'model']);
createEndpoint('/api/options/saleCategories', 'saleCategory', ['make', 'model']);

// API to get cars with filters and sorting
app.get('/api/cars', async (req, res) => {
  try {
    const filters = {};
    ['make', 'model', 'year', 'condition', 'location', 'saleCategory'].forEach(field => {
      if (req.query[field]) {
        filters[field] = field === 'year' ? parseInt(req.query[field], 10) : req.query[field];
      }
    });

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const sortOption = req.query.sort || 'saleDate';
    const sortOrder = req.query.order === 'DESC' ? -1 : 1;

    const totalCars = await Car.find(filters);
    const totalRecords = totalCars.length;
    const totalKM = totalCars.reduce((sum, car) => sum + car.odometer, 0);
    const totalAge = totalCars.reduce((sum, car) => sum + (new Date().getFullYear() - car.year), 0);

    const cars = await Car.find(filters)
                          .sort({ [sortOption]: sortOrder })
                          .skip(skip)
                          .limit(limit);

    res.json({
      cars,
      totalRecords,
      totalKM,
      totalAge
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
