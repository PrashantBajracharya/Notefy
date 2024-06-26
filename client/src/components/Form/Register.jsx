import noteVector from "../../assets/noteTaking.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import errorNotification from "../../utils/notification";
import { ToastContainer } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const password = fd.get("password");
    const reenterPassword = fd.get("reenterPassword");

    if (password === reenterPassword) {
      const formData = Object.fromEntries(fd.entries());      
      axios
        .post("http://localhost:3000/register", formData)
        .then((response) => {
          if (response.status === 409) {
            errorNotification(response.data.messsage);
          }
          navigate("/login");
        })

        .catch((error) => {
          console.log(error);
          if (error.response) {
            let errorMessage = error.response.data.message;
            errorNotification(errorMessage);
          } else {
            errorNotification(error.message);
          }
        });
    } else {
      errorNotification("Passwords don't match.");
    }
  }

  return (
    <div className="flex items-center justify-center my-8 space-x-36">
      <ToastContainer newestOnTop position="bottom-right" />
      <div className="w-1/4 h-full p-4">
        <img
          src={noteVector}
          alt="Note Vector"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="bg-indigo-100 p-8 rounded-md shadow-xl w-1/4">
        <h1 className="text-3xl font-bold mb-4">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              type="text"
              name="firstName"
              placeholder="John"
            />
            <FormInput
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Email"
              type="email"
              name="email"
              placeholder="john.doe@example.com"
            />
            <FormInput label="Date of Birth" type="date" name="dateOfBirth" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Address"
              type="text"
              name="address"
              placeholder="15 Wayford Street"
            />
            <FormInput
              label="Phone number"
              type="number"
              name="phoneNumber"
              pattern="[0-9]{10}"
              placeholder="9812345678"
            />
          </div>
          <label className="block text-sm font-medium text-gray-600">
            Gender
          </label>
          <div className="space-x-4 pb-4">
            <input type="radio" value="Male" name="gender" />
            <span className="text-sm font-medium text-gray-800">Male</span>
            <input type="radio" value="Female" name="gender" />
            <span className="text-sm font-medium text-gray-800">Female</span>
            <input type="radio" value="Others" name="gender" />
            <span className="text-sm font-medium text-gray-800">Others</span>
          </div>

          <FormInput label="Password" type="password" name="password" />
          <FormInput
            label="Re-enter Password"
            type="password"
            name="reenterPassword"
          />
          <button
            type="submit"
            className="bg-indigo-800 text-white py-2 px-4 rounded-md hover:bg-indigo-900"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-800 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
