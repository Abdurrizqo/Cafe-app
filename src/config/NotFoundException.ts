import { HttpException, HttpStatus } from "@nestjs/common";

export class NotFoundException extends HttpException {
    constructor() {
        super("Item Not Found", HttpStatus.NOT_FOUND);
    }
}