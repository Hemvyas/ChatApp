import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../userContext";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f5fa;
  color: #4a4a4a;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 35px;
  width: 30%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;
const Title = styled.h1`
  font-size: 24px;
  font-weight: 500;
  text-align: center;
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
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
left:95%;
top:30%;
cursor:pointer;
transition:all 0.5s ease;
`
const Login = () => {
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible,setVisible]=useState(false);
  const navigate=useNavigate();
  const {login}=useUserContext()

  const handleEmailFocus = () => {
    setEmailFocused(true);
  };
  const handlePasswordFocus = () => {
    setPasswordFocused(true);
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

  const handleShow=()=>{
    setVisible(!visible)
  }

  const toastOptions={
    position:"top-right",
    autoClose:5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme:"dark"
  }

   const handlevalidation=()=>{
     if (
       email === "" ||
       password === "" 
     ) {
       toast.error("Please fill all fields!", toastOptions);
       return false;
     } 
     else if (password.length < 8) {
       toast.error(
         "Password should be at least 8 characters long!",
         toastOptions
       );
       return false;
     }
     return true;
   }

   const handleRegister=async(e)=>{
    e.preventDefault();
    if(handlevalidation()){
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });
        if(res.status===401){
          toast.error("Unauthorized User",toastOptions);
        }
        if(res.status===200){
              document.cookie = `token=${res.data.token}; path=/; secure; samesite=none`;
              login(res.data.other);
              toast.success("User LoggedIn successfully",toastOptions);
        }
        const isAuthenticated = () => {
          const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
            "$1"
          );
          return !!token;
        };
        if (isAuthenticated()) {
          setTimeout(() => {
            navigate("/");
          }, 5000);
        } else {
          toast.error("Unauthorized User", toastOptions);
          console.log("User is not authenticated");
        }
      } catch (error) {
        toast.error(error,toastOptions);
      }
    }
   }

  return (
    <Container>
      <Wrapper>
        <Title>Login</Title>
        <Form>

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
              type={visible?"text":"password"}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
            />
            <Show onClick={handleShow}>{visible?<VisibilityIcon/>:<VisibilityOffIcon/>}</Show>
          </InputContainer>
          <BUTTON onClick={handleRegister}>Login</BUTTON>
        </Form>
      </Wrapper>
      <ToastContainer/>
    </Container>
  );
};

export default Login;
