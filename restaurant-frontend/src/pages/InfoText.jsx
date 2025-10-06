import React from 'react';
import { FiClock, FiMapPin, FiPhone, FiStar } from 'react-icons/fi';

function RestaurantWelcome() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 p-6 rounded-2xl shadow-md max-w-2xl mx-auto relative overflow-hidden mt-10">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200 rounded-full opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-200 rounded-full opacity-10"></div>
      
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3 font-serif">
          Welcome to <span className="text-orange-600">Savory Bites</span>
        </h2>
        
        <p className="text-lg text-gray-700 mb-5 leading-relaxed">
          Where every meal is crafted with <span className="font-semibold text-amber-700">passion</span> and 
          <span className="font-semibold text-orange-600"> tradition</span>. 
          We use only the freshest ingredients to bring you authentic flavors.
        </p>
        
        {/* Restaurant info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
            <FiClock className="text-amber-600 mr-3 text-xl" />
            <div>
              <p className="font-medium text-gray-700">Opening Hours</p>
              <p className="text-sm text-gray-500">Mon-Sun: 11AM - 10PM</p>
            </div>
          </div>
          <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
            <FiMapPin className="text-amber-600 mr-3 text-xl" />
            <div>
              <p className="font-medium text-gray-700">Location</p>
              <p className="text-sm text-gray-500">123 Food Street, Culinary City</p>
            </div>
          </div>
        </div>
        
        {/* Special offer */}
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start">
            <FiStar className="text-orange-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-orange-800">Today's Special</p>
              <p className="text-sm text-orange-700">15% off all pasta dishes - Dine-in only</p>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center">
            <FiPhone className="mr-2" />
            Reserve a Table
          </button>
          <button className="flex-1 border border-orange-600 text-orange-600 hover:bg-orange-50 px-5 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            View Menu
          </button>
        </div>
        
        {/* Rating */}
        <div className="mt-6 flex items-center justify-center text-sm text-gray-600">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className="text-amber-400 w-4 h-4" />
            ))}
          </div>
          <span>4.8 (1,245 reviews)</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantWelcome;