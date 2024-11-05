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
  

  const [file, setFile] = useState(null)

  const [userData, setUserData] = useState({})
  const [education, setEducation] = useState([]);
  const [phds, setPhds] = useState([]);
  const [projects, setProjects] = useState([]);
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    const fetchDetails = async () => {
      const resp = await axios.post(`${baseApiURL()}/admin/details/getDetails`, {employeeId: JSON.parse(localStorage.getItem('id'))})
      setUserData(resp.data.user[0])
      console.log(userData)
      console.log(resp)
      localStorage.setItem("user", JSON.stringify(userData))
    }
    fetchDetails()
  }, [])

  useEffect(() => {
    console.log(userData.profile, userData)
    console.log(userData)
    console.log(firstLogin)
    setEducation(userData.education || [])
    setPhds(userData.phds || [])
    setProjects(userData.projects || [])
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

  const uploadPhdFileToStorage = async (index, name, file) => {
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
          toast.success("Profile Uploaded To Faculty");
          handlePhdChange(index, name, downloadURL)
        });
      }
    );
  };
  
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
      const response = await axios.post(`${baseApiURL()}/admin/details/addDetails`, userData)
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

  const handleSubmitUpdate = async (e) => {
    e.preventDefault()
    
    userData.education = education
    userData.phds = phds
    userData.projects = projects
    userData.employeeId = localStorage.getItem("id")
    console.log(userData)

    try{ 
      const response = await axios.post(`${baseApiURL()}/admin/details/updateDetails/${userData.employeeId}`, userData)
      console.log(response.data)
      localStorage.removeItem("firstLogin")
      setFirstLogin(false)
    }
    catch(err){
      console.log(err)
    }
    setEdit(false)
    console.log(firstLogin)

  }

  return (
    <div className="flex flex-col p-6 bg-whiterounded shadow-md max-w-6xl mx-auto overflow-y-scroll">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>
        <button 
            type="submit" 
            className="text-white bg-blue-700 px-6 py-3 border rounded-md hover:bg-blue-400"
            onClick={e => setEdit(!edit)}
          >
                {edit? "Cancel": "Edit"}
            </button>
      </div>

      {/* Personal Information Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
        
        {/* Display or Edit Fields based on firstLogin */}
        {(firstLogin || edit)  ? (
          <form>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label>
                First Name:
                <input
                  type="text"
                  defaultValue={userData.firstName}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!(firstLogin || edit)}
                  name="firstName"
                  onChange={handleChange}
                  
                />
              </label>

              <label>
                Middle Name:
                <input
                  type="text"
                  defaultValue={userData.middleName}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!(firstLogin || edit)}
                  name="middleName"
                  onChange={handleChange}
                />
              </label>

              <label>
                Last Name:
                <input
                  type="text"
                  defaultValue={userData.lastName}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!(firstLogin || edit)}
                  name="lastName"
                  onChange={handleChange}
                />
              </label>

              <label>
                Employee ID:
                <input
                  type="number"
                  defaultValue={userData.employeeId || localStorage.getItem("id")}
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
                  defaultValue={userData.age}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!(firstLogin || edit)}
                  name="age"
                  onChange={handleChange}
                />
              </label>

              <label>
                Phone Number:
                <input
                  type="tel"
                  defaultValue={userData.phoneNumber}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!(firstLogin || edit)}
                  name="phoneNumber"
                  onChange={handleChange}
                />
              </label>

              <label>
                Gender:
                <select
                  defaultValue={userData.gender}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!(firstLogin || edit)}
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
                  defaultValue={userData.experience}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!(firstLogin || edit)}
                  name="experience"
                  onChange={handleChange}
                />
              </label>

              <label>
                Post:
                <input
                  type="text"
                  defaultValue={userData.post}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!(firstLogin || edit)}
                  name="post"
                  onChange={handleChange}

                />
              </label>

              <label>
                Department:
                <input
                  type="text"
                  defaultValue={userData.department}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!(firstLogin || edit)}
                  name="department"
                  onChange={handleChange}
                  
                />
              </label>

              <label>
                Email:
                <input
                  type="email"
                  defaultValue={userData.email}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  disabled={!(firstLogin || edit)}
                  name="email"
                  onChange={handleChange}
                />
              </label>

              <label>
                Profile Photo:
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full"
                  disabled={!(firstLogin || edit)}
                  name="profilePhoto"
                  onChange={(e) => {setFile(e.target.files[0])}}
                />
              </label>
            </div>
          </form>
        ) : (
          <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
          <div className="flex flex-col md:flex-row justify-between items-start">
            {/* User Information */}
            <div className="flex-grow md:ml-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{`${userData.firstName} ${userData.middleName?userData.middleName:""} ${userData.lastName}`}</h2>
              
              {/* General Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                <p className="text-lg">
                  <span className="font-semibold">Employee ID:</span> {userData.employeeId}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Age:</span> {userData.age}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Phone Number:</span> {userData.phoneNumber}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Gender:</span> {userData.gender}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Experience:</span> {userData.experience} years
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Post:</span> {userData.post}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Department:</span> {userData.department}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Email:</span> {userData.email}
                </p>
              </div>
              
            </div>
            
            {/* Profile Image */}
            <div className="flex-shrink-0 mb-6 md:mb-0">
              <img
                src={userData.profile}
                alt="Profile"
                className="w-36 h-36 rounded-xl border border-gray-300 object-cover shadow-md"
              />
            </div>

          </div>
        </div>


        )}
      </div>

      {/* Education Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Education</h3>
        {(firstLogin || edit) ? (
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
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Education
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {education.map((edu, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium border-r border-gray-200">{edu.type}</td>
                    <td className="py-4 px-6 border-r  border-gray-200">{edu.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Projects</h3>
        {(firstLogin || edit) ? (
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
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Project Title
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider">
                    Git Hub
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {projects.map((project, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium border-r border-gray-200">{project.title}</td>
                    <td className="py-4 px-6 border-r  border-gray-200">{project.description}</td>
                    <td className="py-4 px-6">{project.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        )}
      </div>

      {/* PhD Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">PhDs</h3>
        {(firstLogin || edit) ? (
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
                <input 
                  type="file" 
                  accept=".pdf, .doc, .docx, .txt"
                  className="border border-gray-300 rounded px-3 py-2"
                  name="file"
                  onChange={e => {uploadPhdFileToStorage(index, e.target.name, e.target.files[0])}}
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
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    PHD Title
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider">
                    TYPE
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider">
                    Year Completed
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {phds.map((phd, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium border-r border-gray-200"><a href="phd.file" target="_blank">{phd.name}</a></td>
                    <td className="py-4 px-6 border-r  border-gray-200">{phd.type}</td>
                    <td className="py-4 px-6">{phd.yearCompleted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        
       {(firstLogin || edit) && <div>
            <button 
            type="submit" 
            className="text-white bg-blue-700 px-6 py-3 border rounded-md hover:bg-blue-400"
            onClick={edit? handleSubmitUpdate: handleSubmit}
          >
                save
            </button>
        </div>}
      
    </div>
  );
};

export default FacultyEditForm;
