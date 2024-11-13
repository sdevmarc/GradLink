import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['access_token'];

        if (!token) {
            return false;
        }

        try {
            const payload = this.jwtService.verify(token);
            request.user = payload; // Attach user info to the request object
            return true;
        } catch (err) {
            return false;
        }
    }
}
