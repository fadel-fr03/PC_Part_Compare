import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from "./components/Footer";


function Home() {
  return <h1 className="text-3xl text-center mt-10">Home Page</h1>
}

function Browse() {
  return <h1 className="text-3xl text-center mt-10">Browse Parts</h1>
}

function Login() {
  return <h1 className="text-3xl text-center mt-10">Login Page</h1>
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
        </Routes>
      </div>

      <Footer />
    </div>
  );
}


