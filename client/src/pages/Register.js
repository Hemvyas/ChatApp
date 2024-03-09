import React, { useState } from 'react'
import styled from "styled-components"
import axios from "axios"
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from "react-router-dom"

const Container=styled.div`
height:100vh;
width:100vw;
display:flex;
justify-content:center;
align-items:center;
background:#f2f5fa;
color:#4a4a4a;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 30%;
  border: 2px solid rgba(255,255,255,.5);
  background: transparent;
  border-radius:20px;
  box-shadow:0 0 10px rgba(0,0,0,.5);
`;
const Title = styled.h1`
font-size:24px;
font-weight:500;
text-align:center;
`;
const Form = styled.form`
width:100%;
display:flex;
flex-direction:column;
flex-wrap:wrap;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Label = styled.label`
  position: absolute;
  color: #162938;
  transition: all 0.3s ease-in-out;
  pointer-events: none;
  font-weight: 500;
  top: ${({ focused, hasContent }) => (focused || hasContent ? "15px" : "50%")};
  left: 5px;
  transform: translateY(-50%);
`;
const Input = styled.input`
  flex: 1;
  width: 100%;
  height: 100%;
  margin: 25px 0;
  padding: 7px;
  border: none;
  background: transparent;
  border-bottom: 1.6px solid #162938;
  font-size: 16px;
  outline: none;
`;
const BUTTON = styled.button`
  padding: 15px 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff;
  border: none;
  outline: none;
  background: #4a4a4a;
`;
const Show=styled.span`
position:absolute;
left:90%;
top:30%;
cursor:pointer;
`
const Register = () => {
    const[usernameFocused, setUsernameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
    const[username,setUsername]=useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [visible,setVisible]=useState(false);
    const [show,setShow]=useState(false);
    const navigate=useNavigate();
     const handleUsernameFocus = () => {
       setUsernameFocused(true);
     };
     const handleEmailFocus = () => {
       setEmailFocused(true);
     };
     const handlePasswordFocus = () => {
       setPasswordFocused(true);
     };
     const handleconfirmPasswordFocus = () => {
       setConfirmPasswordFocused(true);
     };

 const handleUsernameBlur = () => {
   if (!username) {
     setUsernameFocused(false);
   }
 };
  const handleEmailBlur = () => {
    if (!email) {
      setEmailFocused(false);
    }
  };
   const handlePasswordBlur = () => {
     if (!password) {
       setPasswordFocused(false);
     }
   };
    const handleconfirmPasswordBlur = () => {
      if (!confirmPassword) {
        setConfirmPasswordFocused(false);
      }
    };

    const handleShow=()=>{
      setVisible(!visible);
    }
    const handleHide = () => {
      setShow(!show);
    };


    const toastOptions = {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };

       const hadleValidation = () => {
         if (
           email === "" ||
           password === "" ||
           confirmPassword === "" ||
           username === ""
         ) {
           toast.error("Please fill all fields!", toastOptions);
           return false;
         } else if (password !== confirmPassword) {
           toast.error("Passwords do not match!", toastOptions);
           return false;
         } else if (username.length < 3) {
           toast.error(
             "Username should be at least 3 characters long!",
             toastOptions
           );
           return false;
         } else if (password.length < 8) {
           toast.error(
             "Password should be at least 8 characters long!",
             toastOptions
           );
           return false;
         }
         return true;
       };

       const handleRegister=async(e)=>{
        e.preventDefault();
        if(hadleValidation())
        {
          try {
             const res=await axios.post("http://localhost:5000/api/auth/register",{
            username,
            confirmPassword,
            email,
            password
          });
          if (res.status === 500) {
            toast.error("Error Registering User", toastOptions);
          }
          if (res.status === 200) {
            toast.success("User Registered Successfully!", toastOptions);
          }
          setTimeout(() => {
            navigate("/login");
          }, 5000);
          } catch (error) {
            console.log(error);
            toast.error("Error Registering User", toastOptions);
          }
        }
       }



  return (
    <Container>
      <Wrapper>
        <Title>Register</Title>
        <Form>
          <InputContainer>
            <Label focused={usernameFocused} hasContent={!!username}>
              Username
            </Label>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              value={username}
              onFocus={handleUsernameFocus}
              onBlur={handleUsernameBlur}
            />
          </InputContainer>

          <InputContainer>
            <Label focused={emailFocused} hasContent={!!email}>
              Email
            </Label>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              value={email}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
            />
          </InputContainer>
          <InputContainer>
            <Label focused={passwordFocused} hasContent={!!password}>
              Password
            </Label>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={show?"text":"password"}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
            />
            <Show onClick={handleHide}>
              {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </Show>
          </InputContainer>
          <InputContainer>
            <Label
              focused={confirmPasswordFocused}
              hasContent={!!confirmPassword}
            >
              Confirm Password
            </Label>
            <Input
              type={visible?"text":"password"}
              onChange={(e) => setconfirmPassword(e.target.value)}
              value={confirmPassword}
              onFocus={handleconfirmPasswordFocus}
              onBlur={handleconfirmPasswordBlur}
            />
            <Show onClick={handleShow}>
              {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </Show>
          </InputContainer>

          <BUTTON onClick={handleRegister}>REGISTER</BUTTON>
        </Form>
      </Wrapper>
      <ToastContainer/>
    </Container>
  );
}

export default Register