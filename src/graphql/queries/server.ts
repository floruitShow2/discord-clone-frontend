import { gql } from "@apollo/client";

export const FETCH_SERVER = gql`
    query GetServers($profileId: Int!) {
        getServers(profileId: $profileId) {
            id
            name
            imageUrl
        }
    }
`