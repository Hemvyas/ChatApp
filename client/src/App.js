import './App.css';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
