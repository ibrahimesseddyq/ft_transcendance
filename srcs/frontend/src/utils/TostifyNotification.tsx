import {toast} from "react-toastify";

const Notification = (msg:string, type:string)=>{
    if (type === "success"){
        toast.success(msg,{
            position: "top-center",
        })
    }else{
        toast.error(msg,{
            position: "top-center",
        })
    }
}

export default Notification;