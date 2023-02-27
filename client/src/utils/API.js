export const accountInfo = () => {
  return fetch("http://localhost:3001/api/me", {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
};

export const currentPriceOf = (Symbol) => {
  return fetch("http://localhost:3001/api/me", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      symbol: Symbol,
    }),
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
};
