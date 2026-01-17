import {toast} from "react-toastify";

const Notification = (msg:string, type:string)=>{
    if (type === "success"){
        toast.success("Form submitted successfully!",{
            position: "top-center",
        })
    }else{
        toast.error(msg,{
            position: "top-center",
        })
    }
    console.log("was here**************");
    
}

export default Notification;