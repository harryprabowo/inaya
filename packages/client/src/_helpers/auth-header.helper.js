import Cookies from 'js-cookie';
import { authenticationService } from "~/_services";

const authHeader = (config) => {
  // return authorization header with jwt token
  const currentUser = authenticationService.currentUserValue;
  const token = Cookies.get("token");

  if (currentUser && token) {
    return { headers: { Authorization: `Bearer ${token}`, ...config } };
  } else {
    return { headers: { ...config } };
  }
};

export default authHeader;
