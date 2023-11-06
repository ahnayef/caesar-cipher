"use client"

import { useReducer } from "react";
import style from "./encrypt.module.css"
import crypto from "crypto";
import { nanoid } from "nanoid";
import { BsShieldLock } from "react-icons/bs"
import { HiMiniLink } from "react-icons/hi2"
import { MdOutlineContentCopy } from "react-icons/md"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"


interface FormState {
    text: string;
    key: number;
    password: string;
    encryptedText: string;
    textLink: string;
}

const initialState: FormState = {
    text: "",
    key: 0,
    password: "",
    encryptedText: "",
    textLink: "",
}

function reducer(state: FormState, action: { field: string, value: string | number }) {
    return { ...state, [action.field]: action.value };
}

function encryptText(text: string, key: number) {
    return text.split("").map((char: string) => {
        if (char >= 'A' && char <= 'Z') {
            return String.fromCharCode(((char.charCodeAt(0) - 65 + key) % 26) + 65);
        } else if (char >= 'a' && char <= 'z') {
            return String.fromCharCode(((char.charCodeAt(0) - 97 + key) % 26) + 97);
        } else {
            return char;
        }
    }).join("");
}

function hashString(p: string) {
    const hash = crypto.createHash('sha256');
    hash.update(p);
    return hash.digest('hex');
}

export default function Page() {

    const [formState, dispatch] = useReducer(reducer, initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ field: e.target.name, value: e.target.value });
    }

    const encrypt = (e: React.FormEvent) => {
        e.preventDefault();

        if (formState.text.includes("!")) {
            formState.text = formState.text.replaceAll("!", ",");
        }
        const encryptedText = encryptText(formState.text, Number(formState.key));
        const password = hashString(formState.password);
        const id = nanoid();
        dispatch({ field: 'encryptedText', value: encryptedText });
        dispatch({ field: 'password', value: password });
        dispatch({ field: 'textLink', value: `http://${location.host}/auth/${password}!${encryptedText}!${id}` });
    }


    const generateLink = () => {

        if (formState.textLink) {

            const msg = toast.loading("Generating link");
            // toast.update(msg, { render: "Link generated", type: "success", isLoading: false, autoClose: 500 });

            const url= encodeURI(formState.textLink);

            axios.get(`https://api.lnk.pw/1.0/public/lnk.pw/link?long=${url}`).then((res)=>{
                const data = res.data;
                navigator.clipboard.writeText(data.link);
                toast.update(msg, { render: "Link copied to clicpboard", type: "success", isLoading: false, autoClose: 500 });

            }).catch((err) => {
                toast.update(msg, { render: "Something went wrong", type: "error", isLoading: false, autoClose: 500 });
            });




        } else {
            toast.error("Something went wrong");
        }

    }


    return (
        <>
            <ToastContainer theme="dark" />
            <div className="over">
            </div>
            <div className={style.encryptMain}>
                <form onSubmit={encrypt}>
                    <h2>Encrypt</h2>
                    <textarea placeholder="Enter text" name="text" onChange={handleChange} maxLength={1500} required />
                    <input type="number" name="key" placeholder="Enter key" min={1} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Enter password" onChange={handleChange} required />
                    <button type="submit"> <i><BsShieldLock /> </i> Encrypt</button>
                    {formState.encryptedText.length > 0 &&
                        <button onClick={generateLink}><i><HiMiniLink /></i> Get link</button>
                    }
                </form>
                {
                    formState.encryptedText.length > 0 &&
                    <div className={style.resultArea}>
                        {/* <h2>Encrypted text</h2> */}
                        <p>{formState.encryptedText}</p>
                        <button> <i><MdOutlineContentCopy /></i> Copy</button>
                    </div>
                }
            </div>
        </>
    )
}