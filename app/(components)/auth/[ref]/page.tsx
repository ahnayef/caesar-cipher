"use client"
import { useState } from "react";
import style from "./auth.module.css"
import crypto from "crypto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState:{userPassword:string, encryptedText:string} = {
    userPassword: "",
    encryptedText: "",
}


function hashString(p: string) {
    const hash = crypto.createHash('sha256');
    hash.update(p);
    return hash.digest('hex');
}

export default function Page({params}: {params: {ref: string}}) {

    const {ref} = params;

    const password = ref.split("!")[0];
    const encryptedText = ref.split("!")[1];

    const [formState, setFormState] = useState(initialState);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({...formState, [e.target.name]: e.target.value});
    }

    console.log(password)
    console.log(encryptedText)



    const handleSubmit = (e:any) => {
        e.preventDefault();

        let userPass = formState.userPassword;
        userPass = hashString(userPass);

        console.log(userPass, password);

        if (userPass === password) {
            setFormState({...formState, encryptedText: encryptedText});
            toast.success("Correct password");
            toast.info("Redirecting to decrypted text");
            location.href = `http://${location.host}/decrypt?text=${encryptedText}`;
        }else{
            toast.error("Wrong password");
        }


    }

    return (
        <>
        <ToastContainer theme="dark"/>

        <div className={style.authMain}>

            <form onSubmit={handleSubmit}>
                <input type="password" name="userPassword" onChange={handleChange}/>
                <button type="submit">Submit</button>
            </form>

        </div>
        </>
    )
}
