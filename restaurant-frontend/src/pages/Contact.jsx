import Location from '../components/Location';

function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center bg-blue-50 p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          Get in Touch with Us
        </h1>
        <p className="text-lg text-blue-800">
          We’re here to help you with any questions or feedback. Our team is dedicated to providing 
          <span className="font-semibold text-blue-600"> reliable</span> and 
          <span className="font-semibold text-blue-600"> friendly</span> support. 
          Feel free to reach out—we love hearing from you!
        </p>
      </div>

      {/* Location Component */}
      <Location />
    </div>
  );
}

export default Contact;
