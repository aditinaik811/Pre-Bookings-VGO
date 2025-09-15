"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import PayButton from "../razorpay/pay-button";

type Ride = {
  ride_id: string;
  ride_name: string;
  description: string;
  price: number;
  duration_minutes: number;
  available: boolean;
};

type Booking = {
  ride_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
};

export default function PackagesSection() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  // booking modal states
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Mangaluru");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(1);
  const [successOpen, setSuccessOpen] = useState(false);

  const [bookedSlots, setBookedSlots] = useState<Booking[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) setUserId(data.user.id);
    })();
  }, []);

  useEffect(() => {
    const fetchRides = async () => {
      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .eq("available", true);

      if (!error && data) setRides(data as Ride[]);
      setLoading(false);
    };

    fetchRides();
  }, []);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!date || !selectedRide) return;
      const { data, error } = await supabase
        .from("bookings")
        .select("ride_id, booking_date, start_time, end_time")
        .eq("ride_id", selectedRide.ride_id)
        .eq("booking_date", date);

      if (!error && data) setBookedSlots(data as Booking[]);
    };

    fetchBookedSlots();
  }, [date, selectedRide]);

  const handleOpenBooking = (ride: Ride) => {
    setSelectedRide(ride);
    setName("");
    setPhone("");
    setLocation("Mangaluru");
    setDate("");
    setTime("");
    setPeople(1);
    setBookedSlots([]);
    setOpenBooking(true);
  };

  const checkSlotConflict = async (
    rideId: string,
    bookingDate: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> => {
    const { data, error } = await supabase
      .from("bookings")
      .select("start_time, end_time")
      .eq("ride_id", rideId)
      .eq("booking_date", bookingDate);

    if (error) {
      console.error(error);
      return true;
    }

    return (
      data?.some(
        (b) =>
          (startTime >= b.start_time && startTime < b.end_time) ||
          (endTime > b.start_time && endTime <= b.end_time) ||
          (startTime <= b.start_time && endTime >= b.end_time)
      ) ?? false
    );
  };

  const handleBookingAfterPayment = async () => {
    if (!name || !phone || !selectedRide || !date || !time) {
      alert("Please fill all required fields");
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const end = new Date();
    end.setHours(hours, minutes + selectedRide.duration_minutes);
    const end_time = `${end.getHours().toString().padStart(2, "0")}:${end
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const { error } = await supabase.from("bookings").insert([
      {
        ride_id: selectedRide.ride_id,
        booking_date: date,
        start_time: time,
        end_time,
        status: "confirmed",
        payment_status: "paid",
        user_id: userId,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Booking failed. Try again.");
      return;
    }

    setOpenBooking(false);
    setSuccessOpen(true);
  };

  if (loading) return <p>Loading rides...</p>;

  return (
    <section id="packages" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-red-500 mb-10">Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {rides.map((ride) => (
          <div
            key={ride.ride_id}
            onClick={() => handleOpenBooking(ride)}
            className="bg-gray-800/60 p-6 rounded-xl hover:scale-105 transition transform shadow-xl cursor-pointer border border-gray-700 hover:border-red-500"
          >
            <h3 className="text-2xl font-semibold">{ride.ride_name}</h3>
            <p className="mt-2 text-gray-300">{ride.description}</p>
            <p className="mt-1 text-red-400 font-bold">₹{ride.price}</p>
            <p className="text-sm text-gray-400">
              {ride.duration_minutes} mins
            </p>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {openBooking && selectedRide && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg text-black relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setOpenBooking(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Book {selectedRide.ride_name}
            </h2>
            <p className="text-gray-600 mb-2">{selectedRide.description}</p>

            <p className="font-bold text-red-500 mb-4">
              Price: ₹{selectedRide.price}
              <span className="text-green-600 ml-6">
                Total Price :₹{selectedRide.price * people}
              </span>{" "}
              ({selectedRide.duration_minutes} mins)
            </p>

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            >
              <option value="Mangaluru">Mangaluru</option>
              <option value="Bangalore">Bangalore</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />

            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">No. of People:</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPeople((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  -
                </button>
                <span className="font-bold">{people}</span>
                <button
                  type="button"
                  onClick={() => setPeople((p) => p + 1)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            {/* ✅ Conflict check BEFORE Razorpay */}
            <PayButton
              rideId={selectedRide.ride_id}
              amount={selectedRide.price * people}
              userId={userId}
              disabled={!name || !phone || !date || !time || !userId}
              beforePayment={async () => {
                const [hours, minutes] = time.split(":").map(Number);
                const end = new Date();
                end.setHours(hours, minutes + selectedRide.duration_minutes);
                const end_time = `${end
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${end
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;

                const hasConflict = await checkSlotConflict(
                  selectedRide.ride_id,
                  date,
                  time,
                  end_time
                );

                if (hasConflict) {
                  alert("⚠️ This slot is already booked. Please choose another time.");
                  return false; // ❌ stop Razorpay
                }
                return true; // ✅ allow Razorpay
              }}
              onSuccess={handleBookingAfterPayment}
            />
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
            <h2 className="text-green-600 text-2xl font-bold mb-2">
              Booked Successfully!
            </h2>
            <p className="text-gray-600">
              Thank you for booking. We’ll contact you shortly.
            </p>
            <button
              onClick={() => setSuccessOpen(false)}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:scale-105 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
