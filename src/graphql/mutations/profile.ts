import { gql } from '@apollo/client'

export const CREATE_PROFILE = gql`
  mutation CreateProfile($profile: CreateProfileInput!) {
    createProfile(profile: $profile) {
      id
      name
      email
      imageUrl
    }
  }
`
