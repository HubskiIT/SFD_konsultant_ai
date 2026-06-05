"use client";
import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";

export default function Debug() {
  const chat = useChat({ api: '/api/chat' });
  const [keys, setKeys] = useState<string[]>([]);
  useEffect(() => {
    setKeys(Object.keys(chat));
  }, [chat]);
  return <pre id="debug-output">{JSON.stringify(keys, null, 2)}</pre>;
}
