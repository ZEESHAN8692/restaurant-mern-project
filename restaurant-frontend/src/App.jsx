import "./App.css";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const NotFound = lazy(() => import("./pages/404"));
const Navbar = lazy(() => import("./components/Navbar"));
const Home = lazy(() => import("./pages/Home"));
const Order = lazy(() => import("./pages/Order"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/adminAccess/AdminDashboard"));
const PrivateRoute = lazy(() => import("./routes/PrivateRoute"));
const GenerateBill = lazy(() => import("./pages/adminAccess/GenerateBill"));
const ProductManager = lazy(() => import("./pages/adminAccess/ProductManager"));
const OrderManagement = lazy(() => import("./pages/adminAccess/OrderManagement"));
const TodayOrders = lazy(() => import("./pages/adminAccess/TodayOrders"));
const AdminAnalytics = lazy(() => import("./pages/adminAccess/AdminAnalytics"));
const Footer = lazy(() => import("./components/Footer"));
const AdminUpcomingBookings = lazy(() => import("./pages/adminAccess/UpcomingTables"));
const Contact = lazy(() => import("./pages/Contact"));

const About = lazy(() => import("./pages/About"));
const Reservations = lazy(() => import("./pages/Reservations"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const RestaurantLoader = lazy(() => import("./components/loader/Loader"));



function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={< RestaurantLoader/>}>
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About/>} />
        <Route path="/Reservations" element={<Reservations/>} />
        <Route path="/testimonials" element={<Testimonials/>} />
        <Route path ="*" element={<NotFound/>}/>
        

        {/* Admin Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            // <PrivateRoute>
              <AdminDashboard />
            // </PrivateRoute>
          }
        />
        <Route path="/admin-today-orders" element={<TodayOrders />} />
        <Route path="/admin-generate-bill" element={<GenerateBill />} />
        <Route path="/admin-product-manager" element={<ProductManager />} />
        <Route path="/admin-order-management" element={<OrderManagement />} />
        <Route path="/admin-book-table" element={<AdminUpcomingBookings/>} />
         <Route path="/admin-analytics" element={<AdminAnalytics/>} />

        {/* Future routes */}
        <Route path="/admin-categories" element={<div>Categories Page</div>} />
       
        <Route path="/admin-settings" element={<div>Settings Page</div>} />
      </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;

