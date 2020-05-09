import { isNullOrUndefined } from "util"
import { history } from ".";
import { authenticationService } from "~/_services";

const localStorageRemovables = [
  "profile.show"
]

const logoutHelper = async (showLoading) => {
  if (!isNullOrUndefined(showLoading)) showLoading(true)

  const res = await authenticationService.logout()

  if (res) {
    if (!isNullOrUndefined(showLoading)) showLoading(false)

    localStorageRemovables.map(e => localStorage.removeItem(e))

    history.replace("/login");
  }
};

export default logoutHelper;
