import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

const useLogout = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
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
  };

  return handleLogout;
};

export default useLogout;
