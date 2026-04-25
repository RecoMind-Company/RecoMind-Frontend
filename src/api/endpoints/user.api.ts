import client from "../client";

export const getUser = (id: string | number) =>
  client.get(`/users/${id}`).then((r) => r.data);
