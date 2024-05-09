import { gql } from "@apollo/client";

export const FETCH_SERVER = gql`
    query GetServers {
        getServers {
            id
            name
            imageUrl
        }
    }
`