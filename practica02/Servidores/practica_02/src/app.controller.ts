import { Controller, Get, Post, Param} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private message = "Daniel!!"

  @Get()
  getHello(): string {
    return `Hola ${this.message}`
  }

  @Post(':name')
  specialMessage(@Param('name') name: string): string{
    return `Hola ${name}, ¿cómo estás?`
  }
}
