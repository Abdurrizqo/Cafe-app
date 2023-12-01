import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenException extends HttpException {
    constructor(erorrMessage:string) {
        super(erorrMessage, HttpStatus.FORBIDDEN);
    }
}