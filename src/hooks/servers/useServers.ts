import { Channel, ChannelType, QueryGetServerArgs, Server } from "@/gql/graphql";
import { Query } from "@/gql/graphql";
import { FETCH_SERVER, FETCH_SERVERS } from "@/graphql/queries/server";
import { RootState } from "@/store";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export function useServers(): { servers: Server[], loading: boolean } {
    const { data: server, loading } = useQuery<Query>(FETCH_SERVERS)
    return { servers: server?.getServers || [], loading }
}

export function useServer() {
    const { serverId } = useParams<{ serverId: string }>()

    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    const navigate = useNavigate()

    const { data: server, loading } = useQuery<Query, QueryGetServerArgs>(FETCH_SERVER, {
        variables: {
            id: Number(serverId)
        },
        onError() {
            navigate('/')
        }
    })

    const channelTypeMap: Record<ChannelType, Channel[]> = {
        [ChannelType.Text]: [],
        [ChannelType.Audio]: [],
        [ChannelType.Video]: []
    }

    server?.getServer.channels?.forEach(channel => {
        if (channel?.type) {
            channelTypeMap[channel.type].push(channel)
        }
    })

    const members = server?.getServer.members?.filter(member => member?.profileId !== userInfo?.id) || []


    return {
        server: server?.getServer,
        loading,
        members,
        textChannels: channelTypeMap[ChannelType.Text],
        audioChannels: channelTypeMap[ChannelType.Audio],
        videoChannels: channelTypeMap[ChannelType.Video]
    }
}