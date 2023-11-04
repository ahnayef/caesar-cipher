"use client"

import { useReducer } from "react";
import style from "./encrypt.module.css"
import crypto from "crypto";
import { nanoid } from "nanoid";

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

        const encryptedText = encryptText(formState.text, Number(formState.key));
        const password = hashString(formState.password);
        const id = nanoid();
        dispatch({ field: 'encryptedText', value: encryptedText });
        dispatch({ field: 'password', value: password });
        dispatch({ field: 'textLink', value: `${location.host}/auth/${password}!${encryptedText}!${id}` });
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