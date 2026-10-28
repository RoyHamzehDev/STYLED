// Lets JwtAuthGuard attach the logged-in user's id to the request (read it with @UserId())
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export {};
