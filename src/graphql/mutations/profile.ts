import { gql } from '@apollo/client'

export const CreateProfile = gql`
  mutation CreateProfile($profile: CreateProfileInput!) {
    createProfile(profile: $profile) {
      id
      name
      email
      imageUrl
    }
  }
`
