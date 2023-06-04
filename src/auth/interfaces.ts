export interface createUserResult {
    email: string,
    authToken: string,
}

export interface createUserProviderResult {
    email: string,
    authToken: string,
    authCookie: string,
}