import { RequestHandler } from "express";
import jwt, { JwtPayload }  from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";


// Define a custom type for the decoded user from the JWT token
interface DecodedUser extends JwtPayload {
  id: string;
  status: string;
}
// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: DecodedUser;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization'].split('Bearer ')[1];
  // console.log('token',token)
  //console.log(token)
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token,
    process.env.JWT || "",
    (err: jwt.VerifyErrors | null, decoded: DecodedUser | undefined) => {
      if (err) return res.status(500).json(err);
      if (!decoded) return res.status(401).json({ message: "Unauthorized" });
      req.user = decoded;
      // console.log('jwt info',req.user)
      next();
    }
  );
};


