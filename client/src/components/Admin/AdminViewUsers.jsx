import React from "react";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import errorNotification from "../../utils/notification";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminViewUsers() {
  const role = useSelector((state) => state.user.role);
  const userId = useSelector((state) => state.user.userId);
  const accessToken = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId === "") {
          errorNotification("User id not set to load profile.");
          return;
        }

        const response = await axios.post(
          "http://localhost:3000/getUsers",
          { userId, role },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response && response.data) {
          setUsersData(response.data.users);
        }
      } catch (error) {
        errorNotification(error.message || "An error occurred.");
      }
    };

    fetchData();
  }, [userId, role, accessToken]);

  async function deleteUser(user) {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?\n\n" +
        "Note: Deleting this user will permanently remove all associated user data, including notes data and token data. This action cannot be undone. Please confirm if you wish to proceed."
      );
  
      if (!confirmDelete) {
        return;
      }

      await axios.delete(
        "http://localhost:3000/deleteUser",      
        {
          data: { userId, role, user },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUsersData((prevData) =>
        prevData.filter((deletedUser) => deletedUser._id !== user)
      );
    } catch (error) {
      errorNotification(error.message || "An error occurred.");
    }
  };

  const filteredUsers = usersData.filter((user) =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="h-screen my-8 flex gap-8">
      <AdminSidebar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-semibold mb-8 text-center">
          User Management
        </h1>
        <div className="mb-4">
          <input
            type="search"
            placeholder="Search by first name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="overflow-x-auto">
          <ToastContainer position="bottom-right" closeOnClick />
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-indigo-400 text-white">
                <th className="px-4 py-2 text-left">First Name</th>
                <th className="px-4 py-2 text-left">Last Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Date of Birth</th>
                <th className="px-4 py-2 text-left">Gender</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Phone Number</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{user.firstName}</td>
                    <td className="border px-4 py-2">{user.lastName}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.dateOfBirth}</td>
                    <td className="border px-4 py-2">{user.gender}</td>
                    <td className="border px-4 py-2">{user.address}</td>
                    <td className="border px-4 py-2">{user.phoneNumber}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                        onClick={() => navigate("/editUser", { state: { user } })}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="border px-4 py-2 text-center font-bold">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default AdminViewUsers;
