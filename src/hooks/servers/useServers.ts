import { Server } from "@/gql/graphql";
import { Query } from "@/gql/graphql";
import { FETCH_SERVER } from "@/graphql/queries/server";
import { useQuery } from "@apollo/client";

export function useServers(): { servers: Server[], loading: boolean } {
    const { data: servers, loading } = useQuery<Query>(FETCH_SERVER)
    return { servers: servers?.getServers || [], loading }
}