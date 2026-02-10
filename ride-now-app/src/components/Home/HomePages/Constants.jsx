import bike from '../../User/UserAssests/bike.avif';
import scooty from '../../User/UserAssests/Scooty.png';
import auto from '../../User/UserAssests/auto.png';
import cabXL from '../../User/UserAssests/cabXL.png';
import cabPremium from '../../User/UserAssests/cabPremium.png';


export const availableCabs = [
  {
    id: 1,
    type: "Sedan",
    baseFare: 150,
    driverName: "Ramesh Kumar",
    rating: 4.8,
    carModel: "Toyota Etios",
    location: [12.974, 77.601], // Near MG Road
  },
  {
    id: 2,
    type: "Hatchback",
    baseFare: 100,
    driverName: "Suresh Singh",
    rating: 4.5,
    carModel: "Maruti Swift",
    location: [12.968, 77.59], // Near Cubbon Park
  },
  {
    id: 3,
    type: "SUV",
    baseFare: 200,
    driverName: "Anjali Sharma",
    rating: 4.9,
    carModel: "Mahindra XUV500",
    location: [12.979, 77.595], // Near Vidhana Soudha
  },
  {
    id: 4,
    type: "Sedan",
    baseFare: 160,
    driverName: "Vikram Reddy",
    rating: 4.7,
    carModel: "Honda City",
    location: [12.965, 77.605], // Near Shanti Nagar
  },
];
 
export const perKmRate = 12; // Change as needed

export const cabRates = {
  Bike: 8,
  Scooty: 9,
  Auto: 12,
  "Cab XL": 18,
  "Cab Premium": 22,
};


export const cabTypes = [
  { name: 'Bike', image: bike },
  { name: 'Scooty', image: scooty },
  { name: 'Auto', image: auto },
  { name: 'Cab XL', image: cabXL },
  { name: 'Cab Premium', image: cabPremium },
];
 