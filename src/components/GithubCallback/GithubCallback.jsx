import axios from "axios";

const Callback = (code) => {
  const client_id = process.env.REACT_APP_CLIENT_ID;
  const client_secret = process.env.REACT_APP_CLIENT_SECRET;
  const getResponse = async () => {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        code,
        client_id, // SAFU application의 정보
        client_secret, // SAFU application의 정보
      },
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    return response;
  };

  //Github가 access_token을 응답으로 줄 것이다.
  getResponse().then(async (response) => {
    const token = response.data.access_token;

    const { data } = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    return data;
  });
};

export default Callback;
