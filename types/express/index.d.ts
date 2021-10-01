import User from '../../models/user';

//  routes/user.ts의 toJSON() 에러 해결.
declare module "express-serve-static-core" {
    interface Request {
        user?: User;
    }
}