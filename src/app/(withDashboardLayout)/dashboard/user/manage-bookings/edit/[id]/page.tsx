"use client";

import LoadingSpinner from "@/components/Shared/LoadingSpinner";
import CarCard from "@/components/UI/Car/CarCard/CarCard";
import {
  useGetSingleBookingQuery,
  useUpdateBookingMutation,
} from "@/redux/api/bookingApi";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

// TODO: Need user single booking api
// TODO: Need update booking api for admin and user

const UpdateBooking = ({ params }: { params: { id: string } }) => {
  const id = params?.id;

  const { data, isLoading } = useGetSingleBookingQuery(id || "");
  const [updateBooking, { isLoading: updateBookingIsLoading }] =
    useUpdateBookingMutation();

  const booking = data?.data;
  const car = booking?.car;

  const [date, setDate] = useState(booking?.date || "");
  const [startTime, setStartTime] = useState(booking?.startTime || "");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!date) newErrors.date = "Date is required.";
    if (!startTime) newErrors.time = "Time is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (validate()) {
        const updateBookingData = {
          _id: booking?._id,
          date,
          startTime: startTime,
        };

        const result = await updateBooking(updateBookingData).unwrap();
        toast.success(result?.message || "Booking Updated Successfully");

        router.push("/dashboard/user/manage-bookings");
      }
    } catch (error: any) {
      console.log("Error: ", error);
      toast.error(error?.data?.message || "Booking Updated failed");
    }
  };

  const handleStartTime = (value: string) => {
    const currentDateTime = new Date();
    const currentTimeHour = currentDateTime.getHours();
    const currentTimeMinute = currentDateTime.getMinutes();
    const currentTime = currentTimeHour + ":" + currentTimeMinute;

    const startTimeHour = value.split(":")[0];

    const startTimeMinute = value.split(":")[1];

    const startTimeHourGreater =
      Number(startTimeHour) > Number(currentTimeHour);

    if (startTimeHourGreater) {
      return setStartTime(value);
    }

    const startTimeHourEqual =
      Number(startTimeHour) === Number(currentTimeHour);

    const startTimeMinuteGreaterOrEqual =
      startTimeHourEqual &&
      Number(startTimeMinute) >= Number(currentTimeMinute);

    if (startTimeMinuteGreaterOrEqual) {
      return setStartTime(value);
    }

    setStartTime(booking?.startTime);
  };

  useEffect(() => {
    if (!isLoading && booking) {
      setDate(booking?.date);
      setStartTime(booking?.startTime);
    }
  }, [isLoading, booking]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Booking Details</h2>
      {booking ? (
        <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0">
          {/* Form for selecting date and time */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border p-8 rounded shadow-md w-full max-w-md "
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Update Pick-up Date & Time
            </h2>

            <div className="mb-4">
              <label htmlFor="date" className="block text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 sm:text-sm ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-xs">{errors.date}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => handleStartTime(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 sm:text-sm ${
                  errors.time ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.time && (
                <p className="text-red-500 text-xs">{errors.time}</p>
              )}
            </div>
            {/* Submit button */}
            <button
              type="submit"
              disabled={updateBookingIsLoading}
              className="bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              Confirm
            </button>
          </form>
          <div className="grid grid-cols-1 gap-8 flex-grow">
            <CarCard car={car} bookingPage />
          </div>
        </div>
      ) : (
        <h3 className="text-2xl font-bold text-center">No data available</h3>
      )}
    </div>
  );
};

export default UpdateBooking;
