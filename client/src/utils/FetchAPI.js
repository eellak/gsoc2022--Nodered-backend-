import axios from "axios";
import { baseUrl } from "../handlers/config";

const FetchApi = (method, url, params, TokenValue) => {
  url = baseUrl + url;
  return new Promise((resolve, reject) => {
    if (TokenValue) {
      axios({
        method: method,
        url: url,
        data: params,
        headers: {
          Authorization: TokenValue,
        },
        responseType: "json",
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    } else {
      axios({
        method: method,
        url: url,
        data: params,
        responseType: "json",
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    }
  });
};

export default FetchApi;
