import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
  };
}

export default RequestWithUser;
