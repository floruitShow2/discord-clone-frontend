import { gql } from '@apollo/client'

export const CREATE_SERVER = gql`
  mutation CreateServer($server: CreateServerInput!, $file: Upload) {
    createServer(server: $server, file: $file) {
      id
      name
      imageUrl
      members {
        id
      }
    }
  }
`
