"use client"

import { useState } from "react";
import style from "./encrypt.module.css"
import crypto from "crypto";
import { nanoid } from "nanoid";


const initialState: { text: string, key: number, password: string, encryptedText: string, textLink: string } = {
    text: "",
    key: 0,
    password: "",
    encryptedText: "",
    textLink: "",
}


export default function Page() {

    const [formState, setFormState] = useState(initialState);


    const handleChange = (e: any) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    }

    const encrypt = (e: any) => {
        e.preventDefault();

        let text = formState.text;
        let key = Number(formState.key);
        let password = formState.password;
        let encryptedText = "";
        let id = nanoid();
        text.split("").forEach((char: string) => {
            if (char >= 'A' && char <= 'Z') {
                let ch = String.fromCharCode(((char.charCodeAt(0) - 65 + key) % 26) + 65);
                encryptedText += ch;
            } else if (char >= 'a' && char <= 'z') {
                let ch = String.fromCharCode(((char.charCodeAt(0) - 97 + key) % 26) + 97);
                encryptedText += ch;
            } else {
                encryptedText += char;
            }
        });

        const stringToHash = (p: string) => {
            const hash = crypto.createHash('sha256');
            hash.update(p);
            return hash.digest('hex');
        }

        
        password = stringToHash(password);

        setFormState({ ...formState, encryptedText: encryptedText, textLink: `${location.host}/auth/${password}!${encryptedText}!${id}` });

        console.log(formState.textLink);

    }


    return (
        <div className={style.EncryptMain}>
            <form onSubmit={encrypt}>
                <textarea placeholder="Enter text" name="text" onChange={handleChange} maxLength={1500} required />
                <input type="number" name="key" placeholder="Enter key" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Enter password" onChange={handleChange} required />
                <button type="submit">Encrypt</button>
                <button type="button">Share</button>
            </form>
        </div>
    )
}
