import React from 'react';
import { Clock, Phone, Mail, MapPin, Users, Award, Heart, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <p className="text-orange-200 font-semibold text-sm uppercase tracking-widest mb-4 animate-fade-in">
              WELCOME TO OUR STORY
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-100">
              About Our Restaurant
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto leading-relaxed">
              Serving authentic flavors and memorable dining experiences in the heart of Chatra, Jharkhand
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Family Dining</h3>
            <p className="text-gray-600 leading-relaxed">
              A warm, welcoming atmosphere perfect for family gatherings and special celebrations.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quality Food</h3>
            <p className="text-gray-600 leading-relaxed">
              Fresh ingredients and authentic recipes prepared with love and attention to detail.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Local Favorite</h3>
            <p className="text-gray-600 leading-relaxed">
              Proudly serving the Chatra community with dishes that bring people together.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Excellent Service</h3>
            <p className="text-gray-600 leading-relaxed">
              Friendly staff dedicated to making your dining experience exceptional every visit.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="flex-1 order-2 lg:order-1">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Culinary Journey</h2>
            <div className="space-y-6">
              <p className="text-gray-600 text-lg leading-relaxed">
                Located in the vibrant Main Branch area of Patel Nagar, Babhance, our restaurant has been a cornerstone of the Chatra community, bringing together families and friends over exceptional food.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We pride ourselves on creating an atmosphere where every meal becomes a celebration, every dish tells a story, and every guest feels like family. Our commitment to quality and service has made us a beloved destination in Jharkhand.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                From traditional favorites to contemporary creations, our menu reflects the rich culinary heritage of our region while embracing modern tastes and preferences.
              </p>
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2">
            <div className="relative">
              <div className="w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Restaurant Interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl opacity-80"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-80"></div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Visit Us Today</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Experience the warmth of our hospitality and the richness of our flavors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-gray-300 leading-relaxed">
                Main Branch<br />
                Patel Nagar, Babhance<br />
                Chatra (Jharkhand) 825401
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-300">
                <a href="tel:+918825374128" className="hover:text-orange-400 transition-colors duration-300">
                  +91 88253 74128
                </a>
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-300">
                <a href="mailto:info7-eleven@gmail.com" className="hover:text-orange-400 transition-colors duration-300">
                  info7-eleven@gmail.com
                </a>
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p className="text-gray-300">
                Mon - Sun<br />
                10:00 AM - 11:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="text-center mt-20 max-w-4xl mx-auto">
          <blockquote className="text-2xl md:text-3xl font-light italic text-gray-700 leading-relaxed mb-6">
            "Good food is the foundation of genuine happiness, and great service makes every meal a cherished memory."
          </blockquote>
          <div className="flex items-center justify-center">
            <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mr-4"></div>
            <p className="text-orange-600 font-semibold text-lg">Our Restaurant Philosophy</p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 ml-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;