import { Validator, ValidatorResult } from "jsonschema";
import { omany } from "../../src/schema/openmath";

type IApiResponse<T extends {}> = IApiFailure | IApiSuccess<T>;

interface IApiFailure {
    success: false,
    message?: string
}

interface IApiSuccess<T> {
    success: true,
    result: T
}

interface IValidationResult {
    valid: boolean,
    errors: ValidatorResult["errors"]
}

export type TValidationResult = IApiResponse<IValidationResult>;

export type TJSONConversionResult = IApiResponse<omany>;
export type TXMLConversionResult = IApiResponse<string>;