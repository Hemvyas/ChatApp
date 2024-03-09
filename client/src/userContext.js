import { createContext,useContext,useEffect,useState } from "react";
import {jwtDecode} from "jwt-decode";
const userContext=createContext();

export const useUserContext=()=>{
    return useContext(userContext);
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  useEffect(()=>{
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      if(token){
        try{
          const decodedToken=jwtDecode(token);
          setUser(decodedToken);
          }catch(err){
            alert('Your session has expired please log in again');
            console.log(err);
            }
      }
      
  },[]);
  return (
    <userContext.Provider value={{ user, login }}>
      {children}
    </userContext.Provider>
  );
};

