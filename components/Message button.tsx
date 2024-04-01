import React from 'react';
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  streamChat,
  useCreateChatClient,
} from 'stream-chat-react';
import { useMutation, useQuery } from "@tanstack/react-query"
// import { tokenProvider } from '@/actions/stream.actions';
import { useUser } from '@clerk/nextjs';
import 'stream-chat-react/dist/css/v2/index.css';



const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
// const token = 'authentication-token';
import { tokenProvider } from '@/actions/stream.actions';
const App: React.FC = () => {
  const { user, isLoaded } = useUser();
  const filters = { type: { $eq: 'messaging' } as const };
  const options = { presence: true, state: true };
  const sort = { last_message_at: -1 as const }; 

  const client = useCreateChatClient({
    apiKey: API_KEY || '',
    tokenOrProvider: tokenProvider || '',
    userData: {
      id: user?.id || '', // Provide a default value if user?.id is undefined
      name: user?.username || user?.id || '', // Use user?.id as a fallback if username is undefined
      image: user?.imageUrl || '', // Provide a default value if user?.imageUrl is undefined
    },
  });

 
  

  if (!client) return <div>Loading...</div>;
  const createChannel = useMutation({
    mutationFn: ({
      name,
      memberIds,
      imageUrl,
    }: {
      name: string
      memberIds: string[]
      imageUrl?: string
    }) => {
      if (streamChat == null) throw Error("Not connected")

      return streamChat
        .channel("messaging", crypto.randomUUID(), {
          name,
          image: imageUrl,
          members: [user, ...memberIds],
        })
        .create()
    })}
  return (
    <Chat client={client}>
      <ChannelList sort={sort} filters={filters} options={options} />
      <Channel  >
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
;

export default App;

