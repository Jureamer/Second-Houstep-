import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new BadRequestException('파일이 존재하지 않습니다.');
    }

    try {
      await this.appService.processFile(file);
      return {
        message: '파일이 정상적으로 처리되었습니다.',
      };
    } catch (error) {
      throw new BadRequestException('파일 처리 중 에러가 발생했습니다.');
    }
  }
}
