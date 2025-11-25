"use client";
import { useUserStore } from "@/app/lib/store/userStore";
import FormPageClient from "./FormPageClient";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <FormPageClient id={id} />;
}
