import axios from "axios";

const API_URL = "http://localhost:8080/v1/passport/";

class AuthService {
  login({email, password}) {
    return axios
      .post(API_URL + "login", {
        email,
        password
      })
      .then(response => {
        if (response.data.code == 200) {
          localStorage.setItem("token", response.data.data.token);
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register({email, name, password}) {
    return axios.post(API_URL + "sign-up", {
      email,
      name,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();