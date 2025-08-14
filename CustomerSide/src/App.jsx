import React, { useState, useEffect } from 'react';
import { Car, Users, Gauge, Menu, X, Calendar, Shield, HeadphonesIcon, MapPin, Phone, Mail } from 'lucide-react';
import logo from "../src/assets/logo/logoRental.png"
import carHero from "../src/assets/HeroPage/car2.png"

// Rental Modal Component
const RentalModal = ({ isOpen, onClose, selectedCar }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    licenseNumber: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Rental request submitted successfully!');
    onClose();
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      pickupDate: '',
      returnDate: '',
      pickupLocation: '',
      licenseNumber: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Rent Your Car</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Selected Car Info */}
        {selectedCar && (
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex items-center space-x-4">
              <img 
                src={selectedCar.image} 
                alt={selectedCar.brand}
                className="w-20 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedCar.brand}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>{selectedCar.engine}</span>
                  <span>•</span>
                  <span>{selectedCar.seats}</span>
                  <span>•</span>
                  <span>{selectedCar.fuel}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rental Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Number *
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your driving license number"
                />
              </div>
            </div>
          </div>

          {/* Rental Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date *
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Date *
                </label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  required
                  min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Location *
              </label>
              <select
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select pickup location</option>
                <option value="cebu-airport">Cebu Airport</option>
                <option value="cebu-city-center">Cebu City Center</option>
                <option value="lahug-area">Lahug Business District</option>
                <option value="it-park">Cebu IT Park</option>
                <option value="ayala-center">Ayala Center Cebu</option>
                <option value="sm-cebu">SM City Cebu</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Submit Rental Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Navbar Component
const Navbar = ({ onRentClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
      <img
        src={logo}
        alt="The Rental Den Logo"
        className="h-15 w-auto mr-2"
      />
      
    </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">HOME</a>
            <a href="#" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">ABOUT US</a>
            <a href="#" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">CARS</a>
            <button 
              onClick={onRentClick}
              className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Rent Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              <a href="#" className="block px-3 py-2 text-gray-900 font-medium">HOME</a>
              <a href="#" className="block px-3 py-2 text-gray-600 font-medium">ABOUT US</a>
              <a href="#" className="block px-3 py-2 text-gray-600 font-medium">CARS</a>
              <a href="#" className="block px-3 py-2 text-gray-600 font-medium">MY BOOKINGS</a>
              <button 
                onClick={onRentClick}
                className="w-full mt-4 bg-black text-white px-6 py-3 rounded-md font-medium"
              >
                Rent Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};


// Hero Section Component
const HeroSection = () =>  {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Trigger zoom-in animation after mount
    setTimeout(() => setLoaded(true), 100);

    // Track scroll for movement
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 items-center relative">
          {/* Left Content */}
          <div className="lg:pr-16 relative z-20">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Find Your <br />
              Perfect Ride <br />
              Today
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              From Comfort to Luxury, <br />
              It's All in One Den
            </p>
          </div>

          {/* Right Content - Car with animation */}
          <div className="relative lg:-ml-24 z-10 h-full -mt-8 flex justify-center">
            {/* Speed Blur Effect */}
            <div
              className="absolute inset-y-10 right-0 w-full rounded-full blur-3xl"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)",
                transform: `translateX(${scrollY * 0.5}px)`,
                zIndex: -1,
              }}
            ></div>

            {/* Car */}
            <img
              src={carHero}
              alt="Honda Civic - Modern sedan car"
              className={`w-full max-w-3xl object-contain drop-shadow-2xl transform transition-all duration-1000 ease-out ${
                loaded ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
              style={{
                transform: `translateX(${scrollY * 0.3}px) scale(${
                  loaded ? 1 : 0.75
                })`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}


// Why Choose Us Component
const WhyChooseUs = () => {
  const features = [
    {
      icon: <Car className="h-10 w-10" />,
      title: "Quality Vehicles",
      description: "We maintain our fleet to the highest standards so you can enjoy a safe and smooth ride every time."
    },
    {
      icon: <Calendar className="h-10 w-10" />,
      title: "Seamless Booking Experience",
      description: "Simple, fast, and user-friendly. Book your car online in minutes, with instant confirmation."
    },
    {
      icon: <HeadphonesIcon className="h-10 w-10" />,
      title: "Local Expertise & Friendly Support",
      description: "Our Cebu-based team is here to help with tailored tips, great deals, and customer support whenever you need it."
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
        <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
          Enjoy a hassle-free ride with reliable cars, fast booking, and 
          friendly support trusted by locals and tourists alike.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-black text-white p-10 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105">
              <div className="text-white mb-8 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-6">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About Section Component
const AboutSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Vertical Image */}
          <div>
            <img 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
              alt="Car side mirror with blurred road background" 
              className="w-full h-[600px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Right Side - Content Placeholder */}
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-center text-gray-500">
              <div className=" rounded-lg flex items-center justify-center ">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-16 text-left">About Rental Den</h2>

              </div>
              <p>"Welcome to The Rental Den, your premier car rental service. We are passionate about providing our customers with an exceptional and seamless rental experience. Born from a love for travel and exploration, we understand the importance of having a reliable vehicle to make your journey memorable. Our mission is to offer a diverse, high-quality fleet, from economy cars for city trips to spacious SUVs for family adventures. We are committed to transparent pricing, straightforward booking, and friendly, local customer support to ensure your complete satisfaction. At The Rental Den, we don't just rent cars; we help you create lasting memories."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Car Card Component
const CarCard = ({ car, onRentClick }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img 
          src={car.image} 
          alt={`${car.brand} car for rent`} 
          className="w-full h-56 object-cover"
        />
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{car.brand}</h3>
        
        {/* Car specifications */}
        <div className="flex items-center justify-between mb-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <Gauge className="h-3 w-3" />
            </div>
            <span>{car.engine}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="h-3 w-3" />
            </div>
            <span>{car.seats}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <Car className="h-3 w-3" />
            </div>
            <span>{car.fuel}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            See Details
          </button>
          <button 
            onClick={() => onRentClick(car)}
            className="flex-1 bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Fleet Section Component
const FleetSection = ({ onRentClick }) => {
  const cars = [
    {
      id: 1,
      brand: "Toyota",
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      engine: "2400 CC",
      seats: "5-Seater",
      fuel: "Petrol"
    },
    {
      id: 2,
      brand: "Toyota",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      engine: "1800 CC",
      seats: "7-Seater",
      fuel: "Hybrid"
    },
    {
      id: 3,
      brand: "Toyota",
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      engine: "1500 CC",
      seats: "5-Seater",
      fuel: "Petrol"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Explore Our Fleet</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find the perfect car for your needs with our special rental offers. We provide a wide 
            selection of vehicles, easy booking, and exceptional value for your next journey.
          </p>
        </div>

        {/* Car Grid - 2 rows, 4 columns on desktop, responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} onRentClick={onRentClick} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Main App Component
const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const handleRentClick = (car = null) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onRentClick={() => handleRentClick()} />
      <HeroSection />
      <WhyChooseUs />
      <AboutSection />
      <FleetSection onRentClick={handleRentClick} />
      
      <RentalModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedCar={selectedCar}
      />
    </div>
  );
};

export default App;