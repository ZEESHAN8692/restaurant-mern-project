import {
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaBus,
  FaTrain,
  FaCar,
  FaUtensils,
} from "react-icons/fa";

function Location() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <FaUtensils className="text-5xl text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Visit Our Restaurant
          </h1>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Experience delicious meals and warm hospitality at our prime
            location. We’re open every day to serve you fresh flavors and
            unforgettable moments.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Address Info */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaMapMarkerAlt className="text-yellow-300" /> Our Address
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Main Branch</h3>
                  <p className="text-gray-600 mt-1 leading-relaxed">
                    Patel Nagar, Babhance, Chatra (Jharkhand) <br />
                    825401
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <FaPhone />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Contact</h3>
                  <p className="text-gray-600 mt-1">
                    Phone: +91 88253 74128 <br />
                    Email: info7-eleven@gmail.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <FaClock />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Opening Hours</h3>
                  <p className="text-gray-600 mt-1">
                    Mon - Sun: 10:00 AM - 11:00 PM
                  </p>
                </div>
              </div>
              <a
                href="tel:+918825374128"
                className="w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-6 rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition"
              >
                <FaPhone /> Call Us Now
              </a>
            </div>
          </div>

          {/* Google Map */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaMapMarkerAlt className="text-yellow-300" /> Location Map
              </h2>
            </div>
            <div className="p-1">
              <iframe
                title="Restaurant Location"
                className="w-full h-80 rounded-b-2xl"
                src="https://www.google.com/maps?q=Patel%20Nagar%20Babhance%20Chatra%20Jharkhand%20825401&output=embed"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* How to Reach */}
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            How To Reach Us
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <FaTrain className="text-blue-600 text-xl" />,
                label: "By Train",
                desc: "Nearest Railway Station: 15 km away",
              },
              {
                icon: <FaBus className="text-blue-600 text-xl" />,
                label: "By Bus",
                desc: "Frequent buses to Chatra town center",
              },
              {
                icon: <FaCar className="text-blue-600 text-xl" />,
                label: "Parking",
                desc: "Free parking space for customers",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-blue-50 p-6 rounded-xl flex flex-col items-center"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h4 className="font-semibold text-gray-800">{item.label}</h4>
                <p className="text-gray-600 mt-2 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;
