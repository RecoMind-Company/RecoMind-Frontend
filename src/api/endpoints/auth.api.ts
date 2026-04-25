import client from "../client";

export const login = (data: any) =>
  client.post("/Authentication/login", data).then((r) => r.data);

export const register = (data: any) =>
  client.post("/Authentication/register", data).then((r) => r.data);
