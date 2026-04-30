import Cookies from "js-cookie";
class Keys {
  static tokenKey = "authorization";
}

export const getToken = () => Cookies.get(Keys.tokenKey);
export const setToken = (token: string | undefined) =>
  Cookies.set(Keys.tokenKey, token);

export const removeToken = () => Cookies.remove(Keys.tokenKey);
