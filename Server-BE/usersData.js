// usersData.js
import bcrypt from "bcrypt";

export const users = await (async () => [
  {
    id: 1,
    email: "test@example.com",
    password: await bcrypt.hash("123456", 10),
  },
  {
    id: 2,
    email: "hola@ejemplo.com",
    password: await bcrypt.hash("abc123", 10),
  },
])();
