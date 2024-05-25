import { request } from "@/utils/service";

enum URLs {
    FetchMessageList = '/api/chat/message/getMessagesList'
}

export const FetchMessageList = (params: Message.FetchMessageListInput) => {
    return request.get<Message.Entity[]>(URLs.FetchMessageList, { params })
}
