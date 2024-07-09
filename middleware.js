// This file is responsible for disallowing a non-authenticated user from accessing the /account route
import { auth } from "./app/_lib/auth";

export const middleware = auth;

export const config = {
  matcher: ["/account"],
};
