import { baseApiURL } from "../../baseUrl";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from "../../firebase/config";

const UploadPHDs = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    yearCompleted: '',
    file: '',
  });
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")))


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhdChange = (name, value) => {
    console.log(name, value)
    setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
    }));
    console.log(formData)
  };

  

  const uploadPhdFileToStorage = async (name, file) => {
    toast.loading("Uploading File to Storage...");
    const storageRef = ref(storage, `Faculty Profile/${userData.employeeId}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error(error);
        toast.dismiss();
        toast.error("Something Went Wrong!");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          toast.dismiss();
          toast.success("File Uploaded Successfully!");
          console.log(downloadURL)
          setFormData({...formData, [name]: downloadURL})
          console.log(formData )
          handlePhdChange(name, downloadURL);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Uploading Data...");
    setUserData({...userData, phds: [...userData.phds, formData]})
    console.log(userData.phds)
    try {
      const response = await axios.post(
        `${baseApiURL()}/faculty/details/updateDetails/${userData.employeeId}`,
        userData
      );

      if (response.status === 200) {
        alert('PHD Details uploaded successfully!');
      }
    } catch (error) {
      console.error("Error uploading PHD details:", error);
      alert('Failed to upload PHD details.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Upload PHD Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-gray-600 font-medium mb-1" htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1" htmlFor="type">Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter PHD type"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1" htmlFor="yearCompleted">Year Completed</label>
          <input
            type="number"
            name="yearCompleted"
            value={formData.yearCompleted}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter year of completion"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1" htmlFor="file">Upload File</label>
          <input
            type="file"
            name="file"
            onChange={e => uploadPhdFileToStorage(e.target.name, e.target.files[0])}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadPHDs;
