export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}

export interface SuccessResponse {
    access_token: string;
}

export interface ErrorResponse {
    status: number;
    msg: string;
    stack?: string;
}

export interface ApiResponse {
    result: object | any[] | null;
    error: ErrorResponse | null;
    status: number
}

export interface LoginDto {
    email: string;
    password: string
}

