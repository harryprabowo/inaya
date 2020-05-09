import { useLocation } from "react-router-dom";

const getParams = (url = window.location.href) => {
  const params = {};
  const parser = document.createElement("a");
  parser.href = url;
  const query = parser.search.substring(1);
  const vars = query.split("&");

  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    params[pair[0]] = decodeURIComponent(pair[1]);
  }

  return params;
};

const delParams = (history) => {
  history.push(window.location.pathname.split("?")[0]);
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

export default {
  getParams,
  delParams,
  useQuery
};
