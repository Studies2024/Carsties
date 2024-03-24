"use client";
import { deleteAuction } from "@/app/actions/auctionActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Props } from "./DeleteButton";

export default function DeleteButton({ id }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function doDelete() {
    setLoading(true);
    deleteAuction(id)
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        router.push("/auctions");
      })
      .catch((error) => {
        toast.error(error.status + " " + error.message);
      });
  }
}
