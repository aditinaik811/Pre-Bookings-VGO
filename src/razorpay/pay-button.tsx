import { useState } from "react";
import { onPay, verifyPayment } from "./razorpay";
import { RazorpayResponseType } from "./razorpay";
import { toast } from "sonner";

type PayButtonProps = {
  rideId: string;
  amount: number;
  userId: string;
  onSuccess?: () => void;
  disabled?: boolean;
  beforePayment?: () => Promise<boolean> | boolean; // ✅ new hook
};

/**
 * PayButton for booking rides. Accepts booking details and amount, and handles payment flow.
 */
export default function PayButton({
  rideId,
  amount,
  userId,
  onSuccess,
  disabled,
  beforePayment, // ✅ added
}: PayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      // ✅ Run conflict check before payment
      if (beforePayment) {
        const ok = await beforePayment();
        if (!ok) {
          return; // ❌ stop payment flow
        }
      }

      setIsLoading(true);
      const resp = await onPay(rideId, amount);
      if (!resp) {
        toast.error("Failed to create payment order");
        setIsLoading(false);
        return;
      }

      const options = {
        key: resp.key,
        amount: Math.round(resp.amount),
        currency: "INR",
        name: "VGO",
        order_id: resp.orderId,
        theme: {
          color: "#00ffbb",
        },
        handler: async function (obj: RazorpayResponseType) {
          try {
            const result = await verifyPayment(obj, userId, amount);
            if (result) {
              toast.success("Payment successful!");
              if (onSuccess) onSuccess();
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Error in payment handling:", error);
            toast.error("Error processing payment");
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      // @ts-expect-error Razorpay global
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment init error:", error);
      toast.error("Failed to initiate payment");
      setIsLoading(false);
    }
  };

  return (
    <button
      className="w-full bg-green-600 text-white py-2 rounded hover:scale-105 transition disabled:opacity-50"
      disabled={isLoading || disabled}
      onClick={handlePayment}
    >
      {isLoading ? "Processing..." : "Pay & Confirm"}
    </button>
  );
}
