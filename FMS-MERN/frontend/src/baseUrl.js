export const baseApiURL = () => {
  const SERVER = process.env.REACT_APP_API_URL
  console.log(SERVER)
  return "http://localhost:5000/api";
};
