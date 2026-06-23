import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Protected from "./components/Protected.jsx";
import ProtectedAdmin from "./components/ProtectedAdmin.jsx";
import Home from "./pages/Home.jsx";
import Groups from "./pages/Groups.jsx";
import GroupDetail from "./pages/GroupDetail.jsx";
import CreateGroup from "./pages/CreateGroup.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grupos" element={<Groups />} />
          <Route path="/grupos/:id" element={<GroupDetail />} />
          <Route path="/crear" element={<Protected><CreateGroup /></Protected>} />
          <Route path="/perfil" element={<Protected><Profile /></Protected>} />
          <Route path="/admin" element={<ProtectedAdmin><Admin /></ProtectedAdmin>} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
