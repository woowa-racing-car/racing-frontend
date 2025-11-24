import {createContext, useContext, useState, useEffect, useCallback} from "react";
import axios from "axios";

const Usercontext=createContext(null);

export const UserProvider =({children}) =>{
    const [user, setUser]=useState({name:"", coin:0, isLoaded:false});

    const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/mypage`,
        { headers: { Authorization: `${token}` } }
      );

      setUser({
        name: data.data.username,
        coin: data.data.money,
        isLoaded: true,
      });
    } catch (err) {
      console.error("사용자 정보 조회 실패:", err);
      setUser((prev) => ({ ...prev, isLoaded: true }));
    }
  }, []);

    const updateCoin = (coin)=>{
        setUser((prev)=>({...prev, coin}));
    };

    const updateUser=({name, coin})=>{
        setUser((prev)=>({...prev, 
            ...(name!==undefined?{name}:{}),
            ...(coin!==undefined?{coin}:{}),
        }));
    };

    useEffect(() => {
      if (location.pathname === "/") {
        setUser((prev) => ({ ...prev, isLoaded: true }));
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setUser((prev) => ({ ...prev, isLoaded: true }));
        return;
      }

      fetchUser();
    }, [location.pathname]);

    return (
        <Usercontext.Provider value={{user, fetchUser, updateCoin, updateUser}}>
            {children}
        </Usercontext.Provider>
    );
}

export const useUser=()=>useContext(Usercontext);