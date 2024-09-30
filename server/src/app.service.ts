import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  
  validateUser(username: string, password: string): { status: string; message: string; username?: string } {
    if (username === 'admin' && password === 'password') {
      return {
        status: 'success',
        message: 'Login successful',
        username: username,
      };
    } else {
      return {
        status: 'error',
        message: 'Invalid username or password',
      };
    }
  }
}
