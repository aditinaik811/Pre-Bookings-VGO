"use server";
import Razorpay from "razorpay";
import crypto, { randomUUID } from "crypto";
import { supabase } from "@/lib/supabaseClient";

export type RazorpayResponseType = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY;

if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET_KEY) {
  throw new Error("Razorpay credentials are not set in environment variables.");
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET_KEY,
});

function generateReceipt(amount: number) {
  const shortUUID = randomUUID().split("-")[0]; // shorten UUID
  const receipt = `rcpt_${shortUUID}_${amount}_${Date.now()}`;
  // Ensure length ≤ 40 (Razorpay requirement)
  return receipt.slice(0, 40);
}

export async function onPay(id: string, amount: number) {
  const notes: any = {};
  notes[`item_${id}`] = { id, amount };

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  const amountInPaise = amount * 100;

  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: generateReceipt(amount),
    notes,
  };

  const order = await razorpay.orders.create(options);

  return {
    orderId: order.id,
    key: RAZORPAY_KEY_ID,
    amount: amountInPaise,
    name: "VGO",
  };
}

// verify payment
export async function verifyPayment(
  obj: RazorpayResponseType,
  userId: string,
  amount: number
) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = obj;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return false;
  }

  if (!RAZORPAY_SECRET_KEY) {
    console.error("Razorpay secret key is not available");
    return false;
  }

  const signString = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_SECRET_KEY)
    .update(signString)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      const { error } = await supabase.from("payments").insert({
        signature: razorpay_signature,
        user_id: userId,
        amount: amount,
        payment_method: "razorpay",
        status: "completed",
        reference_type: "order",
        reference_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      });

      if (error) {
        console.error("Error inserting payment record:", error);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Error updating payment status:", err);
      return false;
    }
  } else {
    return false;
  }
}
