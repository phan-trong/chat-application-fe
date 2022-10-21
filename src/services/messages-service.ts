import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/api/v1/chat-application";

class MessageService {
  getMessage(roomId) {
    console.log(roomId)
    return axios
      .get(API_URL + "/messages/"+roomId)
      .then(response => {
        console.log(response.data)
        // if (response.data.code == 200) {
        //   localStorage.setItem("token", response.data.data.token);
        // }

        return response.data;
      });
  }

  
}

export default new MessageService();