import Link from "next/link";

export default function Error() {
  return(
    <div 
      style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}
    >
      에러가 발생하였습니다.
      <Link href="/">
        <button style={{marginTop: '10vh', padding: '5px 10px'}}>홈으로</button>
      </Link>
    </div>
  )
}