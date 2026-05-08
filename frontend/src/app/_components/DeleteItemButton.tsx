"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type DeleteItemButtonProps = {
  itemId: number;
  itemName: string;
};

export default function DeleteItemButton({
  itemId,
  itemName,
}: DeleteItemButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${itemName}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`${API_BASE}/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete request failed.");
      }

      router.push("/items");
      router.refresh();
    } catch {
      window.alert("Unable to delete this item. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <button
      className="button danger"
      disabled={isDeleting}
      onClick={handleDelete}
      type="button"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
