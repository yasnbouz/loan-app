import { useNavigate } from "@remix-run/react";
import { LottieOptions, useLottie } from "lottie-react";
import { toast } from "sonner";
import successAnimation from "../../assets/success.json";

export function Success() {
  const navigate = useNavigate();
  const options: LottieOptions = {
    animationData: successAnimation,
    loop: false,
    onComplete: () => {
      toast.info("Our team will call you in next few days", { duration: 6000, position: "top-right" });
      setTimeout(() => {
        navigate("/");
      }, 6000);
    },
  };
  const style = { width: 400 };
  const { View } = useLottie(options, style);

  return <div>{View}</div>;
}
