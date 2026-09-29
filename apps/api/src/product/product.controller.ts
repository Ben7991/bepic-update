import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { apiBodyToCreateProduct } from './product.utils';
import { DataMessageInterceptor } from '../utils/interceptors/data-message.interceptor';
import {
  swaggerCreateProductResponse,
  swaggerGetProductsResponse,
} from './product.swagger';
import { PaginatorBuilder } from '../shared/providers/paginator.builder';
import { QueryPaginatorDto } from '../utils/dto/query-paginator.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly _paginatorBuilder: PaginatorBuilder,
    private readonly _productService: ProductService,
  ) {}

  /**
   * Handles pagination of product data
   * @param {QueryPaginatorDto} params - the paginated query params fields
   * @returns a response containing the paginated result
   */
  @ApiOperation(swaggerGetProductsResponse)
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
    return this._productService.paginate(paginator);
  }

  /**
   * Handles incoming request to create a new product
   * @param body the api body
   * @param file the uploaded file
   * @returns the api response
   */
  @ApiBody({
    schema: {
      type: 'object',
      properties: apiBodyToCreateProduct,
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation(swaggerCreateProductResponse)
  @UseInterceptors(FileInterceptor('image'))
  @UseInterceptors(new DataMessageInterceptor('Product added successfully'))
  @Post()
  create(
    @Body(ValidationPipe) body: ProductDto,
    @UploadedFile(
      new ParseFilePipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2 * 1024 * 1024,
            message: 'Image size must be less than or equal to 2MB',
          }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this._productService.create(body, file);
  }
}
