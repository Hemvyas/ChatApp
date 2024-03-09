import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import Friends from "../Friends";
import Message from "../Message";
import NearMeIcon from "@mui/icons-material/NearMe";
import { useUserContext } from "../userContext";
import axios from "axios";
import { io } from "socket.io-client";
import Header from "../components/Header";
import InputEmoji from "react-input-emoji";

const Container = styled.div`
  display: flex;
  height: calc(100vh - 70px);
`;
const Contacts = styled.div`
  flex: 1.6;
  margin-left: 15px;
`;
const ChatBox = styled.div`
  flex: 5.5;
`;
const Wrapper = styled.div`
  padding: 7px;
  height: 100%;
`;
const ChatWrapper = styled.div`
  padding: 7px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
`;
const Chats = styled.div`
  height: 100%;
  overflow-y: ${(props) => (props.overflowing ? "scroll" : "hidden")};
  padding-right: 10px;
  ${(props) =>
    props.overflowing &&
    `
    body::-webkit-scrollbar {
      width: 20px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius:10px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #555; 
}

    ::-webkit-scrollbar-track {
      background-color: #f1f1f1;
          border-radius: 19px;
    `}
`;

const TextBox = styled.div`
  display: flex;
  padding-top:10px;
`;
// const TextArea = styled.textarea`
//   width: 80%;
//   height: 30px;
//   padding: 10px;
//   resize: none;
//   border: 1px solid #ddd;
//   box-shadow: inset 0 -4px no-repeat #f5f5f;
//   outline: none;
// `;
const Button = styled.button`
  background: teal;
  cursor: pointer;
  outline: none;
  border: none;
  padding: 8px;
  color: #fff;
  border-radius: 3px;
  width:40px;
  height:40px;
`;
const Text = styled.span`
  font-weight: 500;
  text-align: center;
  font-size: 50px;
  position: absolute;
  top: 40%;
  left: 40%;
  transform: translate(-40%, -40%);
  cursor: default;
  color: gray;
`;
const Search = styled.input`
  outline: none;
  padding: 5px;
  margin-bottom: 20px;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid gray;
`;
const Chat = ({ our }) => {
  const ChatsRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(true);
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const socket = useRef();
  const [socketMsg, setSocketMsg] = useState(null);
  const [online,setOnline]=useState([]);
  const [emoji,setEmoji]=useState("");
  const scroll = useRef();

  const { user } = useUserContext();

  useEffect(() => {
    socket.current = io("ws://localhost:8000");
    socket.current.on("getMessage", (data) => {
      console.log(data);
      setSocketMsg({
        sender: data.senderId,
        text: data.msg,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    socketMsg &&
      currentChat?.members.includes(socketMsg.sender) &&
      setMessage((prev) => [...prev, socketMsg]);
  }, [socketMsg, currentChat]);

  useEffect(() => {
    socket.current?.emit("addUser", user?._id);
    socket.current?.on("getUser", (users) => {
      setOnline(users);
    });
  }, [user]);

  useEffect(() => {
    if (ChatsRef.current) {
      const overflowing =
        ChatsRef.current.scrollHeight > ChatsRef.current.clientHeight;
      setIsOverflowing(overflowing);
    }
  }, []);

  useEffect(() => {
    const getFriends = async () => {
      if (user && user?._id) {
        const res = await axios.get(
          "http://localhost:5000/api/conversation/" + user?._id
        );
        setConversation(res.data);
      }
    };
    getFriends();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat && currentChat._id) {
          const res = await axios.get(
            `http://localhost:5000/api/message/${currentChat._id}`
          );
          setMessage(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleChange=(emoji)=>{
    setEmoji(emoji);
  }

  const handleClick = async (e) => {
    e.preventDefault();
    if (emoji.trim() === "") {
      alert("fhcnj");
      return;
    }
    const messages = {
      text: emoji,
      sender: user._id,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      msg: emoji,
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/message",
        messages
      );
      setMessage([...message, res.data]);
      setEmoji("");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    scroll.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);

   
  useEffect(()=>{
    const fetchSearchResults=async()=>{
      if(search){
        try {
          const res = await axios.get(`http://localhost:5000/api/conversation/search?username=${search}`);
          const conversation=res.data;
          const otherUsers = await Promise.all(
            conversation.map(async (conversation) => {
              const otherUsersId = conversation.members.find(
                (member) => member !== user._id
              );
              
              if(otherUsersId && conversation?.members.includes(user._id)){
              const userData = await axios.get(
                `http://localhost:5000/api/auth/${otherUsersId}`
              );
              return { ...conversation };
              }
            }));    
          const validResults = otherUsers.filter((result) => result !== null);
          setSearchResults(validResults);
        } catch (error) {
          console.log(error);
          return null;
        }
      }
      else{
        setSearchResults([]);
      }
    }
    const debounceFn=setTimeout(()=>{
      fetchSearchResults();
    },100);
    return ()=>clearTimeout(debounceFn);
  },[search,user])


  const checkOnline=(currentChat)=>{
    const users=currentChat.members.find((member)=>member!==user._id);
    const onlineUsers=online.find((user)=>user.userId===users)
    return onlineUsers?true:false
  }


  return (
    <>
      <Navbar />
      <Container>
        <Contacts>
          <Wrapper>
            <Search
              placeholder="Search for friends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {searchResults.length > 0
              ? searchResults.map((item) => {
                  return (
                    <div onClick={() => setCurrentChat(item)}>
                      <Friends item={item} key={item?._id} currentUser={user} />
                    </div>
                  );
                })
              : conversation.map((item) => (
                  <div onClick={() => setCurrentChat(item)}>
                    <Friends item={item} key={item?._id} currentUser={user} />
                  </div>
                ))}
          </Wrapper>
        </Contacts>

        <ChatBox>
          <ChatWrapper>
            {currentChat ? (
              <>
                <Header
                  chat={currentChat}
                  currentUser={user}
                  onlineUsers={checkOnline(currentChat)}
                />
                <Chats ref={ChatsRef} overflowing={isOverflowing}>
                  {message.map((m) => (
                    <div ref={scroll}>
                      <Message m={m} key={m._id} our={m.sender === user._id} />
                    </div>
                  ))}
                </Chats>
                <TextBox>
                  <InputEmoji
                    value={emoji}
                    onChange={handleChange}
                  />
                  {/* <TextArea
                    placeholder="Type Something..."
                    value={newMessage}
                  /> */}
                  <Button onClick={handleClick}>
                    <NearMeIcon
                      style={{
                        fontSize: 20,
                        display: "flex",
                        alignItems: "center",
                      }}
                    />
                  </Button>
                </TextBox>
              </>
            ) : (
              <Text>Start a Conversation</Text>
            )}
          </ChatWrapper>
        </ChatBox>
      </Container>
    </>
  );
};

export default Chat;
