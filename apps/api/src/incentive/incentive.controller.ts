import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

import { IncentiveDto } from './dto/incentive.dto';
import { IncentiveService } from './incentive.service';
import { DataMessageInterceptor } from '../utils/interceptors/data-message.interceptor';
import {
  swaggerCreateIncentiveResponse,
  swaggerDestroyIncentiveResponse,
  swaggerGetIncentivesResponse,
  swaggerUpdateIncentiveResponse,
} from './incentive.swagger';
import { PaginatorBuilder } from '../shared/providers/paginator.builder';
import { QueryPaginatorDto } from '../utils/dto/query-paginator.dto';

/**
 * Handles all incoming request relating to incentives
 */
@Controller('incentives')
export class IncentiveController {
  constructor(
    private readonly _incentiveService: IncentiveService,
    private readonly _paginatorBuilder: PaginatorBuilder,
  ) {}

  /**
   * Handles pagination of incentive data
   * @param {QueryPaginatorDto} params - the paginated query params fields
   * @returns a response containing the paginated result
   */
  @ApiOperation(swaggerGetIncentivesResponse)
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @Get()
  paginate(@Query() params: QueryPaginatorDto) {
    const paginator = this._paginatorBuilder
      .setPage(params.page)
      .setPerPage(params.perPage)
      .setQuery(params.q)
      .getResult();
    return this._incentiveService.paginate(paginator);
  }

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

  /**
   * Delete existing incentive
   * @param {number} id - the url parameter data
   * @returns a response containing the updated incentive
   */
  @ApiOperation(swaggerDestroyIncentiveResponse)
  @Delete(':id')
  destroy(@Param('id', ParseIntPipe) id: number) {
    return this._incentiveService.destroy(id);
  }
}
