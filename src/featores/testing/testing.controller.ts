import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class AllDeleteController {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  @Delete('/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async dropDB(): Promise<void> {
    await this.dataSource.query(`TRUNCATE TABLE  "Users"`);
    await this.dataSource.query(`TRUNCATE TABLE  "Devise"`);
  }
}
