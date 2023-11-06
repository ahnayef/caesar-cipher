import Link from 'next/link'
import { BsShieldLock } from 'react-icons/bs'
import { AiOutlineUnlock } from 'react-icons/ai'

export default function Home() {
  return (
    <>
    <main className="container">
      <Link href="/encrypt" className='btn'> <i><BsShieldLock /> </i>  Encrypt</Link>
      <Link href="/decrypt" className='btn'> <i><AiOutlineUnlock /></i>Decrypt</Link>
    </main>
    </>
  )
}
