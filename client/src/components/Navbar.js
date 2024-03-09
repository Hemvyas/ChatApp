import React from 'react'
import styled from 'styled-components'
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
const Container=styled.div`
width:100%;
height:55px;
background:aqua;
position:sticky;
top:0;
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content:space-around;
  padding: 10px;
`;
const Left = styled.div`
font-weight:500;
font-size:22px;
margin-left:3px;
cursor:pointer;
`;
const Middle = styled.div`
display:flex;
width:400px;
align-items:center;
background:#fff;
padding:3px;
border-radius:20px;
`;
const Input = styled.input`
width:90%;
padding:4px;
font-size:16px;
border:none;
outline:none;
margin-left:5px;
`;
const Right = styled.div`
display:flex;
align-items:center;
`;

const Badge=styled.span`
border-radius:50%;
background:red;
position:absolute;
right:-5px;
top:-5px;
width:18px;
height:18px;
display:flex;
justify-content:center;
align-items:center;
color:#fff;
font-size:12px;
`
const Icon=styled.div`
position:relative;
margin-right:20px;
cursor:pointer;
`
const Image=styled.img`
width:32px;
height:32px;
object-fit:cover;
border-radius:50%;
cursor:pointer;
`

const Navbar = () => {
  return (
    <Container>
      <Wrapper>
        <Left>Whisper Wave</Left>
        <Middle>
          <Input placeholder="Search for friends" />
          <SearchIcon style={{fontSize:25}} />
        </Middle>
        <Right>
          <Icon>
            <NotificationsIcon style={{fontSize:30}} />
            <Badge>1</Badge>
          </Icon>
          <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
        </Right>
      </Wrapper>
    </Container>
  );
}

export default Navbar