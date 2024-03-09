import React from 'react'
import styled from 'styled-components'
import {format} from "timeago.js"
const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0px;
  align-items:${props=>(props.our?"flex-end":"")};
`;

const Image = styled.img`
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
  margin-right:15px;
`;
const Text=styled.div`
font-size:14px;
display:flex;
max-width:300px;
background:${props=>(props.our?"blue":"aqua")};
padding:5px;
border-radius:7px;
color:${props=>(props.our?"white":"blue")};
`
const Info=styled.div`
display:flex;
margin-bottom:4px;
`
const Time=styled.div`
`
const Date=styled.div`
font-size:12px;
`
const Message = ({ our,m}) => {
  return (
    <Container our={our}>
      <Info>
        <Image src="https://i.pinimg.com/736x/78/ec/0a/78ec0a76ea0c6d31edfc5b33237bbc86.jpg" />
        <Text our={our}>
          {m.text}
        </Text>
      </Info>
      <Time>
        <Date>{format(m.createdAt)}</Date>
      </Time>
    </Container>
  );
};

export default Message