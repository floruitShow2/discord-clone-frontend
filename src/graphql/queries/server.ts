import { gql } from "@apollo/client";

export const FETCH_SERVERS = gql`
    query GetServers {
        getServers {
            id
            name
            imageUrl
        }
    }
`

export const FETCH_SERVER = gql`
    query GetServer($id: Int) {
        getServer(id: $id) {
            id
            profileId
            name
            imageUrl
            inviteCode
            channels {
                id
                type
                name
                profile {
                    id
                    name
                    imageUrl
                }
                members {
                    id
                    role
                    profileId
                    profile {
                        id
                        name
                        imageUrl
                        email
                    }
                }
            }
        }
    }
`