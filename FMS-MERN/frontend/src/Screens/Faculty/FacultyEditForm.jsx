import React, {useEffect, useState} from "react";
import { baseApiURL } from "../../baseUrl";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase/config";
import toast from "react-hot-toast";


const emptyFacultyData = {
    employeeId: parseInt(localStorage.getItem("id")),
    firstName: '',
    middleName: '',
    lastName: '',
    age: 0,
    phoneNumber: '',
    gender: '',
    experience: '',
    post: '',
    department: '',
    email: '',
    profilePhoto: '',
    education_: [],
    phds_: [] ,
    projects_: []
  };
  

const FacultyEditForm = ({ firstLogin, setFirstLogin }) => {
  const {
    employeeId,
    firstName,
    middleName,
    lastName,
    age,
    phoneNumber,
    gender,
    experience,
    post,
    department,
    email,
    profile,
    education_ = [],
    phds_ = [],
    projects_ = []
  } = JSON.parse(localStorage.getItem("user")) || emptyFacultyData;

  const [file, setFile] = useState(null)

  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user"))?JSON.parse(localStorage.getItem("user")):emptyFacultyData)
  const [education, setEducation] = useState(education_ ||  []);
  const [phds, setPhds] = useState(phds_ || []);
  const [projects, setProjects] = useState(projects_ || []);

  useEffect(() => {
    console.log(profile, userData)
    console.log(JSON.parse(localStorage.getItem("user")))
    console.log(firstLogin)
    setEducation(JSON.parse(localStorage.getItem("user")).education || [])
    setPhds(JSON.parse(localStorage.getItem("user")).phds || [])
    setProjects(JSON.parse(localStorage.getItem("user")).projects || [])
    const uploadFileToStorage = async (file) => {
      toast.loading("Upload Photo To Storage");
      const storageRef = ref(
        storage,
        `Faculty Profile/${userData.employeeId}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => { },
        (error) => {
          console.error(error);
          toast.dismiss();
          toast.error("Something Went Wrong!");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            toast.dismiss();
            setFile();
            toast.success("Profile Uploaded To Faculty");
            setUserData({ ...userData, profile: downloadURL });
            console.log(downloadURL, "url", userData)
          });
        }
      );
    };
    file && uploadFileToStorage(file);
  }, [file, userData])
  
  const handleAddEducation = () => {
    setEducation([...education, {type: "", score: ""}]);
  };

  
  const handleAddPhd = () => {
    setPhds([...phds, { name: "", type: "", yearCompleted: "" }]);
  };

  const handleAddProject = () => {
    setProjects([...projects, { title: "", description: "" }]);
  };

  const handleEducationChange = (index, name,  value) => {
    const updatedEducation = [...education];
    updatedEducation[index][name] = value;
    setEducation(updatedEducation);
  };

  const handlePhdChange = (index, field, value) => {
    const updatedPhds = [...phds];
    updatedPhds[index][field] = value;
    setPhds(updatedPhds);
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const handleRemoveEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleRemovePhd = (index) => {
    setPhds(phds.filter((_, i) => i !== index));
  };

  const handleRemoveProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    userData.education = education
    userData.phds = phds
    userData.projects = projects
    userData.employeeId = localStorage.getItem("id")
    console.log(userData)

    try{ 
      const response = await axios.post(`${baseApiURL()}/faculty/details/addDetails`, userData)
      console.log(response.data)
      localStorage.removeItem("firstLogin")
      setFirstLogin(false)
    }
    catch(err){
      console.log(err)
    }
    setFirstLogin(false)
    console.log(firstLogin)
  }

  return (
    <div className="flex flex-col p-6 bg-whiterounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Faculty Profile</h2>

      {/* Personal Information Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
        
        {/* Display or Edit Fields based on firstLogin */}
        {firstLogin  ? (
          <form>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label>
                First Name:
                <input
                  type="text"
                  defaultValue={firstName}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!firstLogin}
                  name="firstName"
                  onChange={handleChange}
                  
                />
              </label>

              <label>
                Middle Name:
                <input
                  type="text"
                  defaultValue={middleName}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!firstLogin}
                  name="middleName"
                  onChange={handleChange}
                />
              </label>

              <label>
                Last Name:
                <input
                  type="text"
                  defaultValue={lastName}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!firstLogin}
                  name="lastName"
                  onChange={handleChange}
                />
              </label>

              <label>
                Employee ID:
                <input
                  type="number"
                  defaultValue={employeeId || localStorage.getItem("id")}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled
                  name="employeeId"
                  onChange={handleChange}
                />
              </label>

              <label>
                Age:
                <input
                  type="number"
                  defaultValue={age}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!firstLogin}
                  name="age"
                  onChange={handleChange}
                />
              </label>

              <label>
                Phone Number:
                <input
                  type="tel"
                  defaultValue={phoneNumber}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!firstLogin}
                  name="phoneNumber"
                  onChange={handleChange}
                />
              </label>

              <label>
                Gender:
                <select
                  defaultValue={gender}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!firstLogin}
                  name="gender"
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>


              <label>
                Experience:
                <input
                  type="number"
                  defaultValue={experience}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!firstLogin}
                  name="experience"
                  onChange={handleChange}
                />
              </label>

              <label>
                Post:
                <input
                  type="text"
                  defaultValue={post}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!firstLogin}
                  name="post"
                  onChange={handleChange}

                />
              </label>

              <label>
                Department:
                <input
                  type="text"
                  defaultValue={department}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!firstLogin}
                  name="department"
                  onChange={handleChange}
                  
                />
              </label>

              <label>
                Email:
                <input
                  type="email"
                  defaultValue={email}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!firstLogin}
                  name="email"
                  onChange={handleChange}
                />
              </label>

              <label>
                Profile Photo:
                <input
                  type="file"
                  className="mt-1 block w-full"
                  disabled={!firstLogin}
                  name="profilePhoto"
                  onChange={(e) => {setFile(e.target.files[0])}}
                />
              </label>
            </div>
          </form>
        ) : (
          <div className="flex justify-between items-start bg-white shadow-md rounded-lg p-6">
            <div className="text-gray-700 grid">
              <p className="text-lg font-semibold"><strong>Name:</strong> {firstName + middleName + lastName}</p>
              <p className="text-lg font-semibold"><strong>Employee ID:</strong> {employeeId}</p>
              <p className="text-lg font-semibold"><strong>Age:</strong> {age}</p>
              <p className="text-lg font-semibold"><strong>Phone Number:</strong> {phoneNumber}</p>
              <p className="text-lg font-semibold"><strong>Gender:</strong> {gender}</p>
              <p className="text-lg font-semibold"><strong>Experience:</strong> {experience} years</p>
              <p className="text-lg font-semibold"><strong>Post:</strong> {post}</p>
              <p className="text-lg font-semibold"><strong>Department:</strong> {department}</p>
              <p className="text-lg font-semibold"><strong>Email:</strong> {email}</p>
            </div>
            <img
              src={userData.profile}
              alt="Profile"
              className="mt-3 w-36 h-36 rounded-xl border border-gray-300 object-cover"
            />
          </div>

        )}
      </div>

      {/* Education Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Education</h3>
        {firstLogin ? (
          <div>
            {education.map((edu, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
                <input
                  type="text"
                  value={edu.type}
                  placeholder="Education Type"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  onChange={(e) => handleEducationChange(index, "type", e.target.value)}
                />
                <input
                  type="text"
                  value={edu.score}
                  placeholder="Score"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  onChange={(e) => handleEducationChange(index, "score", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddEducation}
              className="text-blue-500 hover:underline"
            >
              Add Education
            </button>
          </div>
        ) : (
          <ul className="text-gray-700 list-disc pl-5">
            {education.map((edu, index) => (
              <li key={index}>{edu.type}: {edu.score}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Projects Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Projects</h3>
        {firstLogin ? (
          <div>
            {projects.map((project, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  value={project.title}
                  placeholder="Project Title"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                  onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                />
                <textarea
                  value={project.description}
                  placeholder="Project Description"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveProject(index)}
                  className="text-red-500 hover:underline mt-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddProject}
              className="text-blue-500 hover:underline"
            >
              Add Project
            </button>
          </div>
        ) : (
          <ul className="text-gray-700 list-disc pl-5">
            {projects.map((project, index) => (
              <li key={index}>
                <strong>{project.title}</strong>: {project.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* PhD Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">PhDs</h3>
        {firstLogin ? (
          <div>
            {phds.map((phd, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  value={phd.name}
                  placeholder="PhD Name"
                  className="border border-gray-300 rounded px-3 py-2"
                  onChange={(e) => handlePhdChange(index, "name", e.target.value)}
                />
                <input
                  type="text"
                  value={phd.type}
                  placeholder="Type"
                  className="border border-gray-300 rounded px-3 py-2"
                  onChange={(e) => handlePhdChange(index, "type", e.target.value)}
                />
                <input
                  type="number"
                  value={phd.yearCompleted}
                  placeholder="Year Completed"
                  className="border border-gray-300 rounded px-3 py-2"
                  onChange={(e) => handlePhdChange(index, "yearCompleted", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhd(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPhd}
              className="text-blue-500 hover:underline"
            >
              Add PhD
            </button>
          </div>
        ) : (
          <ul className="text-gray-700 list-disc pl-5">
            {phds.map((phd, index) => (
              <li key={index}>{phd.name} ({phd.type}) - {phd.yearCompleted}</li>
            ))}
          </ul>
        )}
      </div>
        
       {firstLogin && <div>
            <button 
            type="submit" 
            className="text-white bg-blue-700 px-6 py-3 border rounded-md hover:bg-blue-400"
            onClick={handleSubmit}
          >

                save
            </button>
        </div>}
      
    </div>
  );
};

export default FacultyEditForm;
