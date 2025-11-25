"use client";
import EquipmentIdClientPageWrapper from "./_components/EquipmentIdClientPageWrapper";

export default function EquipmentLogPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  return <EquipmentIdClientPageWrapper id={id} />;
}
