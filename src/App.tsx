import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ShutdownTimer() {
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = () => {
    const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60;
    if (totalSeconds <= 0) {
      alert("请输入有效时间");
      return;
    }

    setRemainingSeconds(totalSeconds);
    setIsRunning(true);
  };

  const cancelCountdown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setRemainingSeconds(0);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            // 关机指令
            window.ipcRenderer?.invoke("shutdown");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatCountdown = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}小时${m}分钟${s}秒后关机`;
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="text-lg font-bold text-center">
        {isRunning ? "关机倒计时中..." : "请输入关机时间"}
      </div>

      {!isRunning ? (
        <div className="flex items-center space-x-2 justify-center">
          <Input
            type="number"
            min={0}
            max={23}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-16"
          />
          <span>小时</span>

          <Input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-16"
          />
          <span>分钟后关机</span>
        </div>
      ) : (
        <div className="text-base font-mono text-red-600 text-center">
          {formatCountdown(remainingSeconds)}
        </div>
      )}

      <div>
        {!isRunning ? (
          <Button className="w-full" onClick={startCountdown}>
            开始执行
          </Button>
        ) : (
          <Button
            className="w-full"
            variant="destructive"
            onClick={cancelCountdown}
          >
            取消执行
          </Button>
        )}
      </div>
    </div>
  );
}
