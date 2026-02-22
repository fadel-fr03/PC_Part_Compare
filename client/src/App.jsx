import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Compare from "./pages/Compare";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Browse from "./pages/Browse";
import PartDetail from "./pages/PartDetail";

function Home() {
  return <h1 className="text-3xl text-center mt-10 text-white">Home Page</h1>;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
     

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/parts/:id" element={<PartDetail />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}




