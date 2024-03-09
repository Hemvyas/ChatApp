import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container=styled.div`
`
const Wrapper=styled.div`
display:flex;
align-items:center;
margin-bottom:15px;
cursor:pointer;
padding:10px;
width:230px;
&:hover{
  background:#f9f9f9;
}
`
const Image = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
  margin-right:20px;
`;

const Info=styled.div`
font-size:20px;
font-weight:500;
`
const Friends = ({item,currentUser}) => {
  const [user,setUser]=useState(null);

  useEffect(() => {
    if (currentUser && currentUser._id) {
      const friendsId = item?.members.filter((f) => f !== currentUser._id);
      if (friendsId && friendsId !== user?._id) {
        const getfriends = async () => {
          try {
            const res = await axios.get(
              `http://localhost:5000/api/auth/${friendsId}`
            );
            setUser(res.data);
          } catch (err) {
            console.log(err);
          }
        };

        getfriends();
      }
    }
  }, [currentUser, item, user?._id]);

  return (
    <Container>
      <Wrapper>
        {user && (
          <>
            <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
            <Info>
              <span>{user.username}</span>
            </Info>
          </>
        )}
      </Wrapper>
    </Container>
  );
}

export default Friends