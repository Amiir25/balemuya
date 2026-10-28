export type BookingStatus = "pending" | "accepted" | "declined";

export type MyBooking = {
  id: string;
  status: BookingStatus;
  scheduledDate: string; // "2026-12-01"
  scheduledTime: string; // "14:30"
  address: string;
  notes: string | null;
  createdAt: string;
  provider: { id: string; name: string; service: string };
};