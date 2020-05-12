import axios from "axios";
import Cookies from 'js-cookie';
import { BehaviorSubject } from "rxjs";
import { handleResponse } from "~/_helpers";
import { isNullOrUndefined } from "util";

const currentUserSubject = new BehaviorSubject(
  Cookies.get("token")
    ? Cookies.get("user")
      ? JSON.parse(Cookies.get("user"))
      : true
    : undefined
);

const register = async (
  // firstname,
  // lastname,
  email,
  username,
  password,
  role_id
) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/register`,
      {
        email,
        username,
        password,
        role_id,
      }
    );

    const { jwt_token } = await handleResponse(response)

    // store user details and jwt token in local storage to keep user logged in between page refreshes
    Cookies.set("token", jwt_token, {
      expires: 1,
      sameSite: 'strict'
      // secure: true, // TODO: MAKE HTTPS
    })

    return validate();
  } catch (err) {
    throw handleResponse(err, true);
  }
};

const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/login`,
      { username, password }
    );

    const { jwt_token } = await handleResponse(response);

    // store user details and jwt token in local storage to keep user logged in between page refreshes
    Cookies.set("token", jwt_token, {
      expires: 1,
      sameSite: 'strict'
      // secure: true, // TODO: MAKE HTTPS
    })

    return validate();
  } catch (err) {
    throw handleResponse(err, true);
  }
};

const logout = () => {
  currentUserSubject.next(null);

  // remove user from local storage to log user out
  Cookies.remove("token")
  Cookies.remove("user");

  return Promise.resolve(true)
};

const validate = async () => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    };

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/validate`,
      config
    );

    const data = await handleResponse(response);

    Cookies.set("user", data, {
      sameSite: 'strict'
      // secure: true, // TODO: MAKE HTTPS
    })

    currentUserSubject.next(data);

    return Promise.resolve(currentUserSubject.value);
  } catch (err) {
    throw handleResponse(err, true)
  }
};

const authenticationService = {
  register,
  login,
  logout,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    if (isNullOrUndefined(currentUserSubject.value)) return currentUserSubject.value;
    return validate();
  },
};

export default authenticationService;
