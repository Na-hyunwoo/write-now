import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';

import { useGenerateImg } from "@/hooks/useGenerateImg"

const ReactQuill = dynamic(() => import ('react-quill'), {
  ssr: false
})

interface Props {
  introduction?: string;
}

export default function Editor({ introduction }: Props) {
  const router = useRouter();
  const { data = "", isLoading, error } = useGenerateImg("초콜릿 효능");

  const [value, setValue] = useState<string>();

  const handleChange = (value: string) => {
    setValue(value);
  }

  useEffect(() => {
    if (data) {
      setValue(`<p><Image width={256} height={256} src=${data} alt="초콜릿 효능" /></p>`);
    }
  }, [data])

  if (isLoading || !data) {
    return <>로딩중...</>;
  }

  if (error) {
    router.push('/error');
    console.log(error);
    return<></>;
  }

  return(
    <div>
      <ReactQuill theme="snow" value={value} onChange={handleChange} />
    </div>
  )
}