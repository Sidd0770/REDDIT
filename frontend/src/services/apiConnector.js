import axios from "axios";

const axiosInstance=axios.create({ 
});

const apiConnector=((method,url,bodyData,headers,params)=>{
    console.log("api connector");
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data:bodyData?bodyData:null,
        headers:headers?headers:null,
        params:params?params:null,
    })
})

export default apiConnector;