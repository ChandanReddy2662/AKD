import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseApiURL } from '../../baseUrl';
import toast from 'react-hot-toast';

function FacultyInfo({ id }) {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true); // Set loading state
                const resp = await axios.post(`${baseApiURL()}/faculty/details/getDetails`, { employeeId: id });
                
                // Log the response data for debugging
                console.log('Response Data:', resp.data);
                
                // Assuming user is always an array with at least one item
                if (resp.data.user && resp.data.user.length > 0) {
                    setUserData(resp.data.user[0]);
                } else {
                    toast.error("No faculty details found");
                }
            } catch (e) {
                console.error('Error fetching faculty details:', e);
                toast.error("No faculty details found");
            } finally {
                setLoading(false); // Reset loading state
            }
        };

        if (id) { // Ensure id is valid before fetching
            fetchDetails();
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator
    }

    return (
        <div className="flex flex-col p-6 bg-white rounded shadow-md max-w-6xl mx-auto overflow-y-scroll">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    {/* User Information */}
                    <div className="flex-grow md:ml-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{`${userData.firstName} ${userData.middleName ? userData.middleName : ""} ${userData.lastName}`}</h2>
                        
                        {/* General Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                            <p className="text-lg"><span className="font-semibold">Employee ID:</span> {userData.employeeId}</p>
                            <p className="text-lg"><span className="font-semibold">Age:</span> {userData.age}</p>
                            <p className="text-lg"><span className="font-semibold">Phone Number:</span> {userData.phoneNumber}</p>
                            <p className="text-lg"><span className="font-semibold">Gender:</span> {userData.gender}</p>
                            <p className="text-lg"><span className="font-semibold">Experience:</span> {userData.experience} years</p>
                            <p className="text-lg"><span className="font-semibold">Post:</span> {userData.post}</p>
                            <p className="text-lg"><span className="font-semibold">Department:</span> {userData.department}</p>
                            <p className="text-lg"><span className="font-semibold">Email:</span> {userData.email}</p>
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

            {/* Education Table */}
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
                        {userData.education && userData.education.map((edu, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-4 px-6 font-medium border-r border-gray-200">{edu.type}</td>
                                <td className="py-4 px-6 border-r border-gray-200">{edu.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Projects Table */}
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
                        {userData.projects && userData.projects.map((project, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-4 px-6 font-medium border-r border-gray-200">{project.title}</td>
                                <td className="py-4 px-6 border-r border-gray-200">{project.description}</td>
                                <td className="py-4 px-6">{project.github}</td> {/* Changed to project.github */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PhD Table */}
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
                        {userData.phds && userData.phds.map((phd, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-4 px-6 font-medium border-r border-gray-200">
                                    <a href={phd.link} target="_blank" rel="noopener noreferrer">{phd.name}</a>
                                </td>
                                <td className="py-4 px-6 border-r border-gray-200">{phd.type}</td>
                                <td className="py-4 px-6">{phd.yearCompleted}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FacultyInfo;
