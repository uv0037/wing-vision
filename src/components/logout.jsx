import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import axios from 'axios';

const useLogout = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      // Trigger the logout API call
      await axios.post('http://localhost:8000/delete');  // Replace with your actual API endpoint

      // Perform logout using AuthContext's logout function
      logout();

      // Clear cookies
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle error appropriately, e.g., show a notification
    }
  };

  return handleLogout;
};

export default useLogout;
