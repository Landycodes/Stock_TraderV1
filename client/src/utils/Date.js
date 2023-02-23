import moment from "moment";

export const ts = (timeStamp) => {
  return moment(timeStamp).format("h:mm A");
};
