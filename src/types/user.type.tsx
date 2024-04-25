type Role = 'User' | 'Admin'

export interface User {
    // _id: string
    listRoles: Role[]
    email: string
    username: string
    date_of_birth?: string // ISO 8610
    avatar?: string
    address?: string
    phone?: string
    linkImageAvatar?: string
    status?: boolean
    created?: string,
    name?: {
        fistName: string,
        midName: string,
        lastName: string
    },

}