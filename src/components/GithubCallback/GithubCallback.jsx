import axios from "axios";

const Callback = (code, client_id, client_secret) => {
  const response = axios.post(
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

  //Github가 access_token을 응답으로 줄 것이다.
  const token = response.data.access_token;

  const { data } = axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  return data;
};

export default Callback;
