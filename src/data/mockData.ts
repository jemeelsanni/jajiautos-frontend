// // src/data/mockData.ts
// import type { Car, Sale } from '../types/car';

// export const mockCars: Car[] = [
//   {
//     id: "1", // Changed from number to string
//     name: "Mercedes-Benz G-Class 2024",
//     brand: "Mercedes-Benz",
//     model: "G-Class",
//     price: 180000,
//     originalPrice: 195000,
//     images: [
//       "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&q=80",
//       "https://images.unsplash.com/photo-1494976688763-4eb876351f12?w=500&q=80",
//       "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&q=80"
//     ],
//     image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&q=80",
//     category: "Luxury SUV",
//     year: 2024,
//     mileage: 0,
//     fuel: "Gasoline",
//     fuelType: "Gasoline",
//     transmission: "Automatic",
//     engine: "4.0L V8 Biturbo",
//     horsepower: 577,
//     torque: "627 lb-ft",
//     acceleration: "4.5 seconds (0-60mph)",
//     topSpeed: "149 mph",
//     fuelEconomy: "13/16 mpg",
//     drivetrain: "4MATIC All-Wheel Drive",
//     exteriorColor: "Obsidian Black",
//     interiorColor: "Black Leather",
//     vin: "WDCYC7DF5PX123456",
//     description: "The ultimate luxury SUV with exceptional off-road capabilities and premium comfort. This G-Class combines rugged performance with sophisticated luxury.",
//     features: ["4MATIC All-Wheel Drive", "Premium Leather Interior", "Advanced Safety Package", "360° Camera System", "Adaptive Suspension", "Premium Sound System"],
//     safetyFeatures: ["Blind Spot Monitoring", "Lane Keep Assist", "Automatic Emergency Braking", "Adaptive Cruise Control"],
//     warranty: "4 years / 50,000 miles",
//     featured: true,
//     inStock: 3,
//     rating: 4.8,
//     reviews: 24,
//     isNew: true,
//     dealType: "Special Offer"
//   },
//   {
//     id: "2", // Changed from number to string
//     name: "BMW M4 Competition",
//     brand: "BMW",
//     model: "M4 Competition",
//     price: 95000,
//     originalPrice: 98000,
//     images: [
//       "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&q=80",
//       "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&q=80"
//     ],
//     image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&q=80",
//     category: "Sports Car",
//     year: 2024,
//     mileage: 0,
//     fuel: "Gasoline",
//     fuelType: "Gasoline",
//     transmission: "Automatic",
//     engine: "3.0L Twin-Turbo I6",
//     horsepower: 503,
//     torque: "479 lb-ft",
//     acceleration: "3.8 seconds (0-60mph)",
//     topSpeed: "180 mph",
//     fuelEconomy: "16/23 mpg",
//     drivetrain: "Rear-Wheel Drive",
//     exteriorColor: "Alpine White",
//     interiorColor: "Black/Red Leather",
//     vin: "WBS8M9C0XP1234567",
//     description: "High-performance sports coupe engineered for the track but refined for the street. Pure driving excitement.",
//     features: ["M Sport Package", "Carbon Fiber Accents", "M Performance Exhaust", "Launch Control", "Track Mode", "Premium Audio"],
//     safetyFeatures: ["Dynamic Stability Control", "Cornering Brake Control", "Performance Control"],
//     warranty: "4 years / 50,000 miles",
//     featured: true,
//     inStock: 2,
//     rating: 4.9,
//     reviews: 31,
//     isNew: true,
//     dealType: "Hot Deal"
//   },
//   {
//     id: "3", // Changed from number to string
//     name: "Audi Q8 Prestige",
//     brand: "Audi",
//     model: "Q8 Prestige",
//     price: 85000,
//     originalPrice: 85000,
//     images: [
//       "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&q=80",
//       "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&q=80"
//     ],
//     image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&q=80",
//     category: "Luxury SUV",
//     year: 2024,
//     mileage: 0,
//     fuel: "Gasoline",
//     fuelType: "Gasoline",
//     transmission: "Automatic",
//     engine: "3.0L TFSI V6",
//     horsepower: 335,
//     torque: "369 lb-ft",
//     acceleration: "5.6 seconds (0-60mph)",
//     topSpeed: "155 mph",
//     fuelEconomy: "18/23 mpg",
//     drivetrain: "Quattro AWD",
//     exteriorColor: "Glacier White",
//     interiorColor: "Black Valcona Leather",
//     vin: "WA1BVAF77PD123456",
//     description: "Sophisticated luxury SUV with cutting-edge technology and stunning design.",
//     features: ["Quattro AWD", "Virtual Cockpit Plus", "Matrix LED Headlights", "Premium Audio", "Panoramic Sunroof", "Adaptive Air Suspension"],
//     safetyFeatures: ["Pre Sense City", "Side Assist", "Rear Cross Traffic Alert"],
//     warranty: "4 years / 50,000 miles",
//     featured: false,
//     inStock: 4,
//     rating: 4.7,
//     reviews: 18,
//     isNew: true,
//     dealType: null
//   },
//   {
//     id: "4", // Added new car with string ID
//     name: "Range Rover Sport HSE",
//     brand: "Land Rover",
//     model: "Range Rover Sport HSE",
//     price: 110000,
//     originalPrice: 115000,
//     images: [
//       "https://images.unsplash.com/photo-1494976688763-4eb876351f12?w=500&q=80",
//       "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&q=80"
//     ],
//     image: "https://images.unsplash.com/photo-1494976688763-4eb876351f12?w=500&q=80",
//     category: "Luxury SUV",
//     year: 2024,
//     mileage: 0,
//     fuel: "Gasoline",
//     fuelType: "Gasoline",
//     transmission: "Automatic",
//     engine: "3.0L Supercharged V6",
//     horsepower: 395,
//     torque: "406 lb-ft",
//     acceleration: "6.1 seconds (0-60mph)",
//     topSpeed: "140 mph",
//     fuelEconomy: "18/25 mpg",
//     drivetrain: "Intelligent AWD",
//     exteriorColor: "Santorini Black",
//     interiorColor: "Ebony/Ivory Leather",
//     vin: "SALWR2RV5PA123456",
//     description: "The ultimate luxury SUV with unmatched capability and refinement.",
//     features: ["Terrain Response 2", "Adaptive Air Suspension", "Pivi Pro Infotainment", "Meridian Audio", "Heated/Cooled Seats", "Gesture Sunblind"],
//     safetyFeatures: ["Emergency Braking", "Blind Spot Assist", "Lane Keep Assist"],
//     warranty: "4 years / 50,000 miles",
//     featured: true,
//     inStock: 1,
//     rating: 4.8,
//     reviews: 22,
//     isNew: true,
//     dealType: "Limited Stock"
//   }
// ];

// export const mockSales: Sale[] = [
//   {
//     id: "1",
//     carId: "1", // Changed from number to string
//     customerName: "John Smith",
//     customerEmail: "john@email.com",
//     amount: 180000,
//     date: "2025-06-08",
//     status: "completed",
//     paymentMethod: "Card"
//   },
//   {
//     id: "2",
//     carId: "2", // Changed from number to string
//     customerName: "Sarah Johnson",
//     customerEmail: "sarah@email.com",
//     amount: 95000,
//     date: "2025-06-07",
//     status: "completed",
//     paymentMethod: "Bank Transfer"
//   },
//   {
//     id: "3",
//     carId: "3", // Changed from number to string
//     customerName: "Mike Wilson",
//     customerEmail: "mike@email.com",
//     amount: 85000,
//     date: "2025-06-06",
//     status: "pending",
//     paymentMethod: "Card"
//   }
// ];