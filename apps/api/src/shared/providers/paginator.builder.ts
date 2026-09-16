import { Injectable } from '@nestjs/common';

import { Paginator } from '../../utils/paginator/paginator';

@Injectable()
export class PaginatorBuilder {
  private _paginator: Paginator;
  private PER_PAGE_DEFAULT = 15;
  private PAGE_DEFAULT = 0;

  constructor() {
    this._paginator = new Paginator();
  }

  private _convertToNumber(value: string, defaultValue: number): number {
    const parsedValue = parseInt(value);

    if (Number.isNaN(parsedValue)) {
      return defaultValue;
    }

    return parsedValue;
  }

  setPerPage(perPage: string): PaginatorBuilder {
    this._paginator.perPage = this._convertToNumber(
      perPage,
      this.PER_PAGE_DEFAULT,
    );

    return this;
  }

  setPage(page: string): PaginatorBuilder {
    this._paginator.page = this._convertToNumber(page, this.PAGE_DEFAULT);
    if (this._paginator.page === 1) this._paginator.page = 0;
    if (this._paginator.page > 1) this._paginator.page -= 1;
    return this;
  }

  setQuery(query: string): PaginatorBuilder {
    this._paginator.query = !query ? '' : query;
    return this;
  }

  getResult(): Paginator {
    return this._paginator;
  }
}
