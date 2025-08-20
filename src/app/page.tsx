"use client";
import { useState } from "react";

export default function Home() {
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Mangaluru"); // Location dropdown state

  const pricePerPerson = 200;
  const totalPrice = peopleCount * pricePerPerson;

  const handleOpenBooking = (item) => {
    setSelectedItem(item);
    setPeopleCount(1);
    setName("");
    setDate("");
    setTime("");
    setPhone("");
    setLocation("Mangaluru"); // Reset to default location on new booking
    setOpenBooking(true);
  };

  const handlePeopleChange = (count) => {
    if (count < 1) return;
    setPeopleCount(count);
  };

  const handleBookingSubmit = () => {
    if (!date || !time || !phone || !name) {
      alert("Please fill all required fields");
      return;
    }
    setOpenBooking(false);
    setSuccessOpen(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white relative">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-[url('/background.jpeg')] bg-cover bg-center filter blur-sm scale-105"
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-red-500 drop-shadow-lg">
            Feel the Thrill of Go-Karting
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Speed, Safety & Adrenaline – All in One!
          </p>
          <button
            onClick={() =>
              document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-6 px-6 py-3 bg-red-500 text-white rounded-full hover:scale-105 transition transform shadow-lg"
          >
            Book Now
          </button>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-red-500 mb-10">Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              onClick={() => handleOpenBooking(`Package ${id}`)}
              className="bg-gray-800/60 p-6 rounded-xl hover:scale-105 transition transform shadow-xl cursor-pointer border border-gray-700 hover:border-red-500"
            >
              <h3 className="text-2xl font-semibold">{`Package ${id}`}</h3>
              <p className="mt-2 text-gray-300">
                Fun go-karting experience with speed & safety.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Occasions Section */}
      <section id="occasions" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-red-500 mb-10">Occasions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Birthday Party", "Corporate Party", "Family Party"].map((occasion) => (
            <div
              key={occasion}
              onClick={() => handleOpenBooking(occasion)}
              className="bg-gray-800/60 p-6 rounded-xl hover:scale-105 transition transform shadow-xl cursor-pointer border border-gray-700 hover:border-red-500"
            >
              <h3 className="text-2xl font-semibold">{occasion}</h3>
              <p className="mt-2 text-gray-300">
                Celebrate your {occasion.toLowerCase()} at our track!
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      {openBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg text-black relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setOpenBooking(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-red-600">Book for {selectedItem}</h2>
            <div className="mb-4">
              <label>Number of People:</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => handlePeopleChange(peopleCount - 1)}
                  className="px-3 py-1 border rounded"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  value={peopleCount}
                  onChange={(e) => handlePeopleChange(parseInt(e.target.value) || 1)}
                  className="w-16 border rounded text-center"
                />
                <button
                  onClick={() => handlePeopleChange(peopleCount + 1)}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Price:</span>
                <span className="font-bold text-red-600 text-xl">₹{totalPrice}</span>
              </div>
            </div>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            >
              <option value="">-- Select a Time --</option>
              <option>10:00 AM - 11:00 AM</option>
              <option>11:00 AM - 12:00 PM</option>
              <option>12:00 PM - 1:00 PM</option>
              <option>2:00 PM - 3:00 PM</option>
              <option>3:00 PM - 4:00 PM</option>
              <option>4:00 PM - 5:00 PM</option>
            </select>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            {/* Location dropdown */}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option value="Mangaluru">Mangaluru</option>
              <option value="Bangalore">Bangalore</option>
            </select>
            <button
              onClick={handleBookingSubmit}
              className="w-full bg-red-500 text-white py-2 rounded hover:scale-105 transition"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
            <h2 className="text-green-600 text-2xl font-bold mb-2"> Booked Successfully!</h2>
            <p className="text-gray-600">Thank you for booking. We’ll contact you shortly.</p>
            <button
              onClick={() => setSuccessOpen(false)}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:scale-105 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
