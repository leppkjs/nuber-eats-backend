import {NextFunction} from 'express';
import {Injectable, NestMiddleware} from '@nestjs/common';
import {JwtService} from './jwt.service';
import {UsersService} from '../users/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware{
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) {
    }

    async use(req: Request, res: Response, next: NextFunction) {
        if('x-jwt' in req.headers) {
            const token: string = req.headers['x-jwt'];
            const decoded = this.jwtService.verify(token);

            if(typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
                try {
                    req['user'] = await this.usersService.findById(decoded['id']);
                }catch (e) {}
            }

        }

        next();
    }
}
