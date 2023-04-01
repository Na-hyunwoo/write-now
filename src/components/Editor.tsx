import { useGenerateImg } from "@/hooks/useGenerateImg"
import Image from "next/image";
import { useRouter } from "next/router";

interface Props {
  introduction?: string;
}

{/* editor로 slate 사용하기 ? */}
export default function Editor({ introduction }: Props) {
  const { data = "", isLoading, error } = useGenerateImg("초콜릿 효능");
  const router = useRouter();

  if (isLoading) {
    return <>로딩중...</>;
  }

  if (error) {
    router.push('/error');
    console.log(error);
    return<></>;
  }

  return(
    <div>
      <Image width={256} height={256} src={data} alt="초콜릿 효능" />
    </div>

  )
}