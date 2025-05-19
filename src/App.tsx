// src/App.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function App() {
  const [delay, setDelay] = useState("60");

  const handleShutdown = () => {
    window.ipcRenderer.send("shutdown", Number(delay));
  };

  return (
    <div className="flex w-full items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 w-[360px] space-y-6 border">
        <h1 className="text-center text-2xl font-bold text-gray-900">
          定时关机工具
        </h1>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground block">
            延迟时间（秒）
          </label>
          <Input
            type="number"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            placeholder="输入时间（秒）"
          />
        </div>

        <Button
          onClick={handleShutdown}
          className="w-full bg-black hover:bg-black/90 text-white transition"
        >
          启动定时关机
        </Button>
      </div>
    </div>
  );
}
