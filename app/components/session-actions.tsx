"use client";

import { useTransition } from "react";
import { markSessionComplete, markSessionNoShow } from "@/app/lib/actions";

// ponytail: botones con server actions, sin form innecesario

export function SessionActionButtons({ appointmentId }: { appointmentId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          startTransition(async () => {
            await markSessionComplete(appointmentId);
          });
        }}
        disabled={isPending}
        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
        title="Marcar como completada"
      >
        {isPending ? (
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <button
        onClick={() => {
          startTransition(async () => {
            await markSessionNoShow(appointmentId);
          });
        }}
        disabled={isPending}
        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
        title="Marcar como no asistió"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
