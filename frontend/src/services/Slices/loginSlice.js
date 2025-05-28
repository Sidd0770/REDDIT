import {createSlice} from '@reduxjs/toolkit';

const initialState={
    userId:'',
    isLogin:false,
    user:'',
    password:'',
    email:'',
}

export const loginSlice = createSlice({
    name:'islogin',
    initialState:initialState,
    reducers:{
        setUserId:(state,action)=>{
            state.userId=action.payload;
        },
        setLogin:(state,action)=>{
            state.isLogin=action.payload;
        },
        setUser:(state,action)=>{
            state.user=action.payload;
        },
        setPassword:(state,action)=>{
            state.password=action.payload;
        },
        setEmail:(state,action)=>{
            state.email=action.payload;
        },    
    }    
})

export const {setLogin,setUser,setPassword,setEmail,setUserId}=loginSlice.actions;
export default loginSlice.reducer;