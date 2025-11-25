"use client";
import EquipmentIdClientPage from "./EquipmentIdClientPage";

interface EquipmentIdClientPageWrapperProps {
  id: string;
}

export default function EquipmentIdClientPageWrapper({
  id,
}: EquipmentIdClientPageWrapperProps) {
  return <EquipmentIdClientPage id={id} />;
}
