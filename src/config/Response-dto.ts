export interface ResponseDto<T> {
    data: T|T[]
    currentPage?: number;
    limit?: number;
    totalElement?: number;
    totalPage?: number;
    credential?: any;
}