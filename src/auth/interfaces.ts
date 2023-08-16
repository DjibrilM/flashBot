import { requestPasswordUpdate } from "./auth.dto"

export interface createUserResult {
    email: string,
    authToken: string,
}

export interface createUserProviderResult {
    email: string,
    authToken: string,
    authCookie: string,
    id: string,
    profileImage: string
}


export interface requestPasswordUpdateInterface {
    canUpdate: boolean
}