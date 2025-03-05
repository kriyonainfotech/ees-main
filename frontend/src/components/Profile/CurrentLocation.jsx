// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { FaEdit } from "react-icons/fa";

// const backend_API = import.meta.env.VITE_API_URL;

// const CurrentLocation = ({ user }) => {
//   const [location, setLocation] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [pincode, setPincode] = useState('');
//   const [error, setError] = useState("");
//   // Fetch current location using Geolocation and Nominatim API

//   const fetchLocationDetails = async (pincode) => {
//     try {
//       const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await response.json();
//       if (data[0].Status === 'Success') {
//         const postOffice = data[0].PostOffice[0];
//         console.log(postOffice, "location poste");
//         if (postOffice) {
//           setLocation({
//             area: postOffice.Name || "",
//             city: postOffice.District || "",
//             state: postOffice.State || "",
//             country: postOffice.Country || "",
//             pincode: postOffice.Pincode || "",
//           });
//           // toast.success("Location fetched successfully!");
//         } else {
//           toast.error("Unable to fetch location details. Please try again.");
//         }

//         setError('');
//       } else {
//         setError('Invalid Pincode! Please enter a valid one.');

//       }
//     } catch (err) {
//       setError('Failed to fetch location details. Try again later.');

//     }
//   };

//   const handlePincodeChange = (e) => {
//     const inputPincode = e.target.value.trim();
//     setPincode(inputPincode);
//     if (inputPincode.length === 6) {
//       fetchLocationDetails(inputPincode);
//     }
//   };

//   // Update the user's profile with the fetched location
//   const updateProfile = async () => {
//     if (!location.area && !location.city && !location.state && !location.country && !location.pincode) {
//       toast.error("Please fetch your current location first!");
//       return;
//     }

//     setLoading(true);
//     const token = JSON.parse(localStorage.getItem("token"));

//     try {
//       const response = await axios.post(
//         `${backend_API}/auth/updateProfile`,
//         { address: location }, // Send the location as part of the request body
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include the token if required
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.status === 200) {
//         setIsEditing(false); // Disable editing after update
//         window.location.reload();
//       } else {
//         toast.error("Failed to update location");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("Failed to update profile. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="d-flex  gap-2">
//         <p className="text-gray mb-0">
//           {user?.address?.area} {user?.address?.city} {user?.address?.state}{" "}
//           {user?.address?.country} {user?.address?.pincode}
//         </p>
//         <FaEdit
//           className="md:text-md cursor-pointer d-none d-md-flex  "

//           onClick={() => {
//             if (isEditing) {
//               updateProfile(); // Save on second click
//             }
//             setIsEditing(!isEditing); // Toggle editing mode
//           }}
//         />

//       </div>
//       <div className="border p-1 rounded-1 d-md-none" onClick={() => {
//         if (isEditing) {
//           updateProfile(); // Save on second click
//         }
//         setIsEditing(!isEditing); // Toggle editing mode
//       }}>
//         Current Location
//       </div>
//       {isEditing && (
//         <>
//           <div className="">
//             <label className="block text-sm font-medium">Pincode</label>
//             <input
//               type="text"
//               value={pincode}
//               onChange={handlePincodeChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>
//           <p className="bg-white">
//             {location.area} {location.city} {location.state} {location.country}{" "}
//             {location.pincode}
//             <button onClick={updateProfile} className="btn border ms-2">Update</button>
//           </p>
//         </>
//       )}
//     </div>
//   );
// };

// export default CurrentLocation;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

const backend_API = import.meta.env.VITE_API_URL;

const CurrentLocation = ({ user }) => {
  const [location, setLocation] = useState(user?.address || {});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      checkLocationPermission();
    }
  }, [isEditing]);

  // ✅ Check if Location Permission is Granted
  const checkLocationPermission = async () => {
    if (!navigator.permissions) return;
    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      if (permission.state === "denied") {
        toast.error(
          "Location permission denied. Please enable it in browser settings."
        );
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error checking permission:", error);
    }
  };

  // ✅ Function to Fetch Highly Accurate Location
  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude, "Longitude:", longitude);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18&addressdetails=1`
          );
          const data = await response.json();

          if (data.address) {
            const {
              suburb,
              village,
              city,
              town,
              state_district,
              state,
              country,
              postcode,
            } = data.address;
            console.log("Fetched Address:", data.address);

            setLocation({
              area: suburb || village || town || city || "",
              city: state_district || "",
              state: state || "",
              country: country || "",
              pincode: postcode || "",
            });

            toast.success("Location fetched successfully!");
          } else {
            toast.error("Failed to fetch location. Try again.");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          toast.error("Failed to fetch location details.");
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        toast.error("Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ✅ Update User's Profile with Location
  const updateProfile = async () => {
    if (
      !location.area ||
      !location.city ||
      !location.state ||
      !location.country ||
      !location.pincode
    ) {
      toast.error("Please fetch your current location first!");
      return;
    }

    setLoading(true);
    const token = JSON.parse(localStorage.getItem("token"));

    try {
      const response = await axios.post(
        `${backend_API}/auth/updateProfile`,
        { address: location },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
        toast.success("Location updated successfully!");
        setLocation(location); // ✅ Updates UI without reloading
      } else {
        toast.error("Failed to update location");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex gap-2">
        <p className="text-gray mb-0">
          {location.area} {location.city} {location.state} {location.country}{" "}
          {location.pincode}
        </p>
        <FaEdit
          className="md:text-md cursor-pointer"
          onClick={() => setIsEditing(!isEditing)}
        />
      </div>

      {isEditing && (
        <div className="d-flex align-items-center gap-3 p-3 border rounded bg-light mt-2">
          <button
            onClick={fetchUserLocation}
            className="btn btn-outline-primary"
          >
            Get Location
          </button>

          <p className="mb-0 flex-grow-1 text-center">
            {location.area} {location.city} {location.state} {location.country}{" "}
            {location.pincode}
          </p>

          <button
            onClick={updateProfile}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrentLocation;
