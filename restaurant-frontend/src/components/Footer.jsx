import React from 'react';
import { MapPin, Phone, Mail, Heart, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
        
        {/* Restaurant Info */}
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            7-Eleven Restaurant
          </h3>
          <p className="text-gray-300 mt-2">
            Delicious meals crafted with love and the freshest ingredients.
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-gray-300">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-orange-400" />
            <span>Patel Nagar Babhance, Chatra (JH) 825401</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-green-400" />
            <a href="tel:8825374128" className="hover:text-white transition-colors">+91 88253 74128</a>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-400" />
            <a href="mailto:info7-eleven@gmail.com" className="hover:text-white transition-colors">info7-eleven@gmail.com</a>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex space-x-3">
          <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-all duration-300">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 transition-all duration-300">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-400 transition-all duration-300">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 transition-all duration-300">
            <Youtube className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-gray-400 text-sm">
          © {currentYear} 7-Eleven Restaurant. Made with <Heart className="inline h-4 w-4 text-red-400 mx-1" /> for food lovers.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
