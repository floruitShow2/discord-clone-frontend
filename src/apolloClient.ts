import { InMemoryCache } from '@apollo/client/cache'
import { ApolloClient } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'

loadDevMessages()
loadErrorMessages()

const getCookie = (name: string) => {
  const val = `; ${document.cookie}`
  const parts = val.split(`; ${name}=`)
  if (parts) return parts.pop()?.split(';').shift()
}

const authLink = setContext(async (_, { headers }) => {
  const token = getCookie('__session')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const uploadLink = createUploadLink({
  uri: 'http://localhost:3000/graphql',
  headers: {
    'apollo-require-preflight': 'true'
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(`[GraphQL error] Message: ${message} Locations: ${locations} Path: ${path}`)
    })
  }

  if (networkError) {
    console.log(`[Network Error]: ${networkError}`)
  }
})

const cache = new InMemoryCache()
const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(uploadLink),
  cache
})

export default client
