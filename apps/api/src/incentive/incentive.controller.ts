import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { IncentiveDto } from './dto/incentive.dto';
import { IncentiveService } from './incentive.service';
import { DataMessageInterceptor } from '../utils/interceptors/data-message.interceptor';
import {
  swaggerCreateIncentiveResponse,
  swaggerUpdateIncentiveResponse,
} from './incentive.swagger';

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

  /**
   * Update existing incentive
   * @param {IncentiveDto} body - the request body
   * @returns a response containing the updated incentive
   */
  @ApiOperation(swaggerUpdateIncentiveResponse)
  @UseInterceptors(new DataMessageInterceptor('Incentive updated successfully'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    body: IncentiveDto,
  ) {
    return this._incentiveService.update(body, id);
  }
}
