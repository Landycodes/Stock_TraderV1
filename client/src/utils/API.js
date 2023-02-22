export const accountInfo = () => {
  return fetch("http://localhost:3001/api/me", {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
};
