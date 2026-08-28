import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

import { IncentiveDto } from './dto/incentive.dto';
import { IncentiveService } from './incentive.service';
import { DataMessageInterceptor } from '../utils/interceptors/data-message.interceptor';
import { ApiOperation } from '@nestjs/swagger';
import { swaggerCreateIncentiveResponse } from './incentive.swagger';

/**
 * Handles all incoming request relating to incentives
 */
@Controller('incentives')
export class IncentiveController {
  constructor(private readonly _incentiveService: IncentiveService) {}

  /**
   * Creates an incentive
   * @param {IncentiveDto} body - the request body
   * @returns a response containing the new incentive
   */
  @ApiOperation(swaggerCreateIncentiveResponse)
  @UseInterceptors(new DataMessageInterceptor('Incentive added successfully'))
  @Post()
  create(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    body: IncentiveDto,
  ) {
    return this._incentiveService.create(body);
  }
}
