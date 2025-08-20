"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // make sure this exists

// Card Components
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

// Main Prebooking Section with Book Now Logic
export default function PrebookingSection() {
  const contactRef = React.useRef<HTMLDivElement>(null);
  const [isBooked, setIsBooked] = React.useState(false);

  const handleBookNow = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      setIsBooked(true);
    }, 1500); // delay to simulate scroll/booking
  };

  return (
    <main className="p-6 space-y-10">
      {/* Section: Packages, Occasions, etc. */}
      <section>
        <h2 className="text-2xl font-bold text-red-700 mb-4">Pre-Booking</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Select your desired go-karting package.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Occasions</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Book for birthdays, team outings, and more.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Time Slot</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Choose the best time for your ride.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Pick your nearest track.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Book Now Button */}
      <div className="text-center">
        <Button className="bg-red-700 text-white hover:bg-red-800" onClick={handleBookNow}>
          Book Now
        </Button>
      </div>

      {/* Contact Info */}
      <section ref={contactRef} id="contact-info" className="mt-12">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Contact Info</h2>
        <p className="text-gray-700">Provide your contact details for confirmation.</p>

        {isBooked && (
          <p className="mt-4 text-green-600 font-semibold">🎉 Booked Successfully!</p>
        )}
      </section>
    </main>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
