"use client"
import style from "./auth.module.css"

export default function Page() {

    const handleSubmit = (e:any) => {
        e.preventDefault();

    }

    return (
        <div className={style.authMain}>
            <form onSubmit={handleSubmit}>
                <h1>Hello</h1>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
