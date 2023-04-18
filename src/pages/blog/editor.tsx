import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';

import { useGenerateImg } from "@/hooks/useGenerateImg"
import { useConclusion, useIntroduction, useMainSubject, useSubject } from "@/stores/editor";

const ReactQuill = dynamic(() => import ('react-quill'), {
  ssr: false
})

export default function Editor() {
  const router = useRouter();
  const { subject } = useSubject();
  const { introduction } = useIntroduction();
  const { mainSubject } = useMainSubject();
  const { conclusion } = useConclusion();
  const { data = "", isLoading, error } = useGenerateImg(subject);

  const [value, setValue] = useState<string>();

  const handleChange = (value: string) => {
    setValue(value);
  }

  useEffect(() => {
    if (data) {
      setValue(
        `
          <p>
            <Image width={256} height={256} src=${data} alt=${subject} />
          </p>
          <p>
            ${introduction}
          </p>
          <p><br></p>
          <p> 
            ${mainSubject}
          </p>
          <p><br></p>
          <p>
          ${conclusion}
          </p>
        `);
    }
  }, [data])

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
      <ReactQuill theme="snow" value={value} onChange={handleChange} />
    </div>
  )
}