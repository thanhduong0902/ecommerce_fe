import http from "../utils/http";

export interface Group {
  group_id: number;
  name: string;
  last_message: {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
    user_id: number;
    group_id: number;
  };
  unread: number;
}

export interface Message {
  content: string;
  created_at: string;
  group_id: string;
  id: number;
  updated_at: string;
  user_id: number;
}

export interface IGroup {
  groups: Group[];
  chanel_name: string;
  event_name: string;
}
const chatApi = {
  getGroup() {
    return http.get<IGroup>("v1/admin/chat/groups");
  },
};

export default chatApi;
