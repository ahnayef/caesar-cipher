"use client"

import Link from "next/link";
import { useEffect, useState } from "react"
import { AiOutlineUnlock } from "react-icons/ai";

const initialState: { encodedText: string, decodedText: string, key: number } = {
  encodedText: "",
  decodedText: "",
  key: 0
}


function decodeText(text: string, key: number) {
  key = key % 26; // Ensure the key is between 0 and 25

  return text.split("").map((char: string) => {
    if (char >= 'A' && char <= 'Z') {
      return String.fromCharCode(((char.charCodeAt(0) - 65 - key + 26) % 26) + 65);
    } else if (char >= 'a' && char <= 'z') {
      return String.fromCharCode(((char.charCodeAt(0) - 97 - key + 26) % 26) + 97);
    } else {
      return char;
    }
  }).join("");
}

export default function Page({ searchParams, }: { searchParams?: { [key: string]: string | string[] | undefined } }) {

  const [formState, setFormState] = useState(initialState);

  const encodedText = searchParams?.text;

  useEffect(() => {
    if (encodedText) {
      setFormState({ ...formState, encodedText: encodedText as string });
    }
  }, [])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  const decode = (e: React.FormEvent) => {
    e.preventDefault();
    const encodedText = formState.encodedText;
    setFormState({ ...formState, decodedText: decodeText(encodedText, formState.key) });
  }

  return (
    <>
      <div className="over">
      </div>
      <div className="container">
        <form onSubmit={decode}>
          <input type="text" name="encodedText" onChange={handleChange} value={formState.encodedText} />
          <input type="number" placeholder="Enter key" name="key" onChange={handleChange} required />
          <button type="submit"><i><AiOutlineUnlock/></i> Decrypt</button>
        </form>
        {
          formState.decodedText &&
          <div className="resultArea">
            <p>{formState.decodedText}</p>
          </div>
        }
        <Link href="/" className="btn">Home</Link>
      </div>
    </>
  )
}
