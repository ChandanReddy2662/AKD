import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Notice from "../../components/Notice";
import Profile from "./Profile";
import Timetable from "./Timetable";
import { Toaster, toast } from "react-hot-toast";
import Material from "./Material";
import Marks from "./Marks";
import Student from "./Student";
import Attendance from "./Attendance";
import FacultyEditForm from "./FacultyEditForm";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import UploadPHDs from "./UploadPHDs";

const Home = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("My Profile");
  const [load, setLoad] = useState(false);
  const [firstLogin, setFirstLogin] = useState(false);
  const [data, setData] = useState({});
  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.state === null) {
      navigate("/");
    }
    setFirstLogin(localStorage.getItem("firstLogin") === "true");
    setLoad(true);
  }, []);

  return (
    <section>
  {load && (
    <>
      <Navbar />
      <ul className="flex justify-evenly items-center gap-10 w-[85%] mx-auto my-8">
        <li
          className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
            selectedMenu === "My Profile"
              ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
              : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
          }`}
          onClick={() => setSelectedMenu("My Profile")}
        >
          My Profile
        </li>
        {/* <li
          className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
            selectedMenu === "Student Info"
              ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
              : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
          }`}
          onClick={() => setSelectedMenu("Student Info")}
        >
          Student Info
        </li> */}
        <li
          className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
            selectedMenu === "Upload Marks"
              ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
              : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
          }`}
          onClick={() => setSelectedMenu("Upload Marks")}
        >
          Upload PHDs
        </li>
        <li
          className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
            selectedMenu === "Timetable"
              ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
              : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
          }`}
          onClick={() => setSelectedMenu("Timetable")}
        >
          Timetable
        </li>
        <li
          className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
            selectedMenu === "Notice"
              ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
              : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
          }`}
          onClick={() => setSelectedMenu("Notice")}
        >
          Notice
        </li>
        <li
          className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
            selectedMenu === "Material"
              ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
              : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
          }`}
          onClick={() => setSelectedMenu("Material")}
        >
          Material
        </li>
        {/* <li
          className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
            selectedMenu === "Attendance"
              ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
              : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
          }`}
          onClick={() => setSelectedMenu("Attendance")}
        >
          Attendance
        </li> */}
      </ul>
      <>
        {selectedMenu === "Timetable" && <Timetable />}
        {selectedMenu === "Attendance" && <Attendance />}
        {selectedMenu === "Upload Marks" && <UploadPHDs />}
        {selectedMenu === "Notice" && <Notice />}
        {selectedMenu === "My Profile" && (
          <FacultyEditForm firstLogin={firstLogin} setFirstLogin={setFirstLogin} />
        )}
      </>
    </>
  )}
  <Toaster position="bottom-center" />
</section>

  );
};

export default Home;
