import { Response } from "../types"

export const response = ({result, status, error}:Response) => {
    return ({
        status:status ? status : 'ok',
        result: result && result,
        error: error && {
            errorCode:error?.errorCode,
            message:error?.message
        }
    })
}