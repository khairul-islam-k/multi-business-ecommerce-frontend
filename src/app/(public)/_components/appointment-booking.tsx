// components/AppointmentBooking.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const times = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export default function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState(10);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-8">Book a Free Expert Meeting</h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Calendar */}
        <div>
          <h3 className="font-semibold mb-4">Select a date</h3>
          <div className="bg-gray-50 p-6 rounded-2xl">
            <div className="text-center mb-6">
              <p className="text-lg font-medium">April 2026</p>
            </div>
            {/* Simplified Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {Array.from({ length: 30 }, (_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(i + 1)}
                  className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                    selectedDate === i + 1
                      ? "bg-blue-600 text-white! shadow-md"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="font-semibold mb-4">Available time (1 hour)</h3>
          <div className="grid grid-cols-2 gap-3">
            {times.map((time) => (
              <motion.button
                key={time}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedTime(time)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedTime === time
                    ? "border-blue-600 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{time}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100"
              >
                <p className="text-blue-700 font-medium">
                  ✓ {selectedTime} on April {selectedDate}, 2026 (Online)
                </p>
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white! py-3 rounded-2xl font-semibold">
                  Confirm Meeting
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
