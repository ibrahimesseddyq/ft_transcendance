import {toast} from "react-toastify";

const Notification = (msg:string, type:string)=>{
    if (type === "success"){
        toast(msg,{
            position: "bottom-right",
            style: { 
                color: '#00adef',
                background: '#ffffff'
            },
        })
    }else{
        toast.error(msg,{
            position: "bottom-right",
        })
    }
}

export default Notification;