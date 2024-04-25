import { User } from './user.type'
import { SuccessResponse } from './utils.types'

export type AuthResponse = {
    token: string
    // refresh_token: string
    expires_refresh_token: number
    expires: number
    username: string
    email: string
    listRoles: any
}

export type RefreshTokenReponse = { access_token: string }