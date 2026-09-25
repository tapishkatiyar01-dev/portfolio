'use client'

import { useEffect, useRef } from "react";

export default function DateString()
{
    let currentDate = useRef("");

    useEffect(()=>
    {
        currentDate.current= new Date().toLocaleString();
    }, [])

  return(
    <span>{currentDate.current}</span>
  );
}