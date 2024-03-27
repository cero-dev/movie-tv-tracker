import "./styles.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvier } from "../context/userContext";
import MovieSearch from "./pages/MovieSearch";
import Favorites from "./pages/Favorites";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvier>
      <Navbar />
      <Toaster position="botton-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/moviesearch" element={<MovieSearch />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </UserContextProvier>
  );
}

export default App;
