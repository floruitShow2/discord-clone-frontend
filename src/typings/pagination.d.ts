declare namespace Pagination {
  interface Input {
    page: number
    pageSize: number
  }

  interface Entity<T> {
    content: T[]
    page: number
    pageSize: number
    totalPages: number
    totalElements: number
  }
}
