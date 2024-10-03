import { IsNumber, IsOptional, Min } from "class-validator";
import { CoreOutput } from "./core-output.dto";

export class PaginationInput {
    @IsOptional()
    @IsNumber()
    page?: number;
}

export class PaginationOutput extends CoreOutput {
    @IsOptional()
    totalPages?: number;

    @IsOptional()
    totalResults?: number;
}