import { QueryGetServersArgs, Server } from "@/gql/graphql";
import { Query } from "@/gql/graphql";
import { FETCH_SERVER } from "@/graphql/queries/server";
import { RootState } from "@/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

export function useServers(): { servers: Server[], loading: boolean } {
    const { userInfo } = useSelector((state: RootState) => state.user)
    
    if (!userInfo) return { servers: [], loading: false }

    const { data: servers, loading } = useQuery<Query, QueryGetServersArgs>(FETCH_SERVER, {
        variables: {
            profileId: userInfo.id
        }
    })

    return { servers: servers?.getServers || [], loading }
}