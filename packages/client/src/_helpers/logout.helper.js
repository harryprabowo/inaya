import { isNullOrUndefined } from "util"
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

    window.location.replace("/login");
  }
};

export default logoutHelper;
