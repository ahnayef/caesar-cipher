import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <Link href="/encrypt">Encrypt</Link>
      <Link href="/decrypt">Decrypt</Link>
    </main>
  )
}
