import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
const Container=styled.div`
height:80px;
width:100%;
top:0;
position:sticky;
border:1px solid #000;
z-index:9;
`
const Image = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 20px;
`;

const Info=styled.div`
font-size:20px;
font-weight:500;
`
const Wrapper=styled.div`
padding:10px;
display:flex;
align-items:center;
margin-left:10px;
`
const Online = styled.div`
  font-size: 15px;
  font-weight:400;
`;
const Header = ({ chat, currentUser,onlineUsers }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const friendsId = chat?.members?.find((f) => f.id !== currentUser._id);
    const getFriend = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/${friendsId}`
        );
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriend();
  }, [chat, currentUser]);
  return (
    <Container>
      <Wrapper>
        <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
        <Info>
          <span>{data?.username}</span>
          <Online>{onlineUsers && <span>online</span>}</Online>
        </Info>
      </Wrapper>
    </Container>
  );
};

export default Header