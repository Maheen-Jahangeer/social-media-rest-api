export interface Response {
    status?:String,
    result?:String,
    error?:{
        errorCode?:string,
        message?:String
    }
}