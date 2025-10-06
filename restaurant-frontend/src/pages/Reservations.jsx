import React from "react";
import BookTable from "../components/BookTable";
import { FaClock, FaUtensils, FaMapMarkerAlt } from "react-icons/fa";

function Reservations() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Reserve Your Table</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Book a table at our restaurant and enjoy a delightful dining experience. 
          Fill out the form below to secure your spot.
        </p>
      </div>

      {/* Booking Form Section */}
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-md -mt-12">
        <BookTable />
      </div>

      {/* Additional Info Section */}
      <div className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center">
          <FaClock className="text-yellow-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Opening Hours</h3>
          <p>Mon - Sun: 10:00 AM - 11:00 PM</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <FaUtensils className="text-yellow-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Specialties</h3>
          <p>Enjoy a variety of gourmet dishes prepared with fresh ingredients daily.</p>
        </div>

        <div className="flex flex-col items-center text-center">
          <FaMapMarkerAlt className="text-yellow-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Location</h3>
          <p>123 Foodie Street, Flavor Town, FT 56789</p>
        </div>
      </div>

      {/* Call to Action / Footer Note */}
      {/* <div className="bg-yellow-100 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Dine With Us?</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Reserve your table now and enjoy an unforgettable experience.
        </p>
      
      </div> */}
    </div>
  );
}

export default Reservations;
