import Cookies from 'js-cookie';
import { BehaviorSubject } from "rxjs";
import { config } from "~/_helpers";
import { isNullOrUndefined } from 'util';

const { api } = config

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
  const response = await api().post(
    `/user/register`,
    {
      email,
      username,
      password,
      role_id,
    }
  );

  // store user details and jwt token in local storage to keep user logged in between page refreshes
  Cookies.set("token", response.jwt_token, {
    expires: 1,
    sameSite: 'strict'
    // secure: true, // TODO: MAKE HTTPS
  })

  return validate();
};

const login = async (username, password) => {
  const response = await api().post(
    `/user/login`,
    {
      username,
      password
    }
  );


  // store user details and jwt token in local storage to keep user logged in between page refreshes
  Cookies.set("token", response.jwt_token, {
    expires: 1,
    sameSite: 'strict',
    // secure: true, // TODO: MAKE HTTPS
  })

  return validate();
};

const logout = () => {
  currentUserSubject.next(null);

  // remove user from local storage to log user out
  Cookies.remove("token")
  Cookies.remove("user");

  return Promise.resolve(true)
};

const validate = async () => {
  const response = await api(true).get(`/user/validate`);

  Cookies.set("user", response, {
    sameSite: 'strict'
    // secure: true, // TODO: MAKE HTTPS
  })

  currentUserSubject.next(response);

  return Promise.resolve(currentUserSubject.value);
};

const authenticationService = {
  register,
  login,
  logout,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return isNullOrUndefined(currentUserSubject.value)
      ? currentUserSubject.value
      : validate();
  },
};

export default authenticationService;
