"use client";

import { useAuctionStore } from "@/hooks/useAuctionStore";
import { useBidStore } from "@/hooks/useBidStore";
import { Auction, AuctionFinished, Bid } from "@/types";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { User } from "next-auth";
import React, { useEffect, useState } from "react";
import AuctionCreatedToast from "../components/AuctionCreatedToast";
import toast from "react-hot-toast";
import AuctionFinishedToast from "../components/AuctionFinishedToast";
import { getDetailedViewData } from "../actions/auctionActions";

type Props = {
  children: React.ReactNode;
  user: User | null;
};

export default function SignalRProvider({ children, user }: Props) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice);
  const addBid = useBidStore((state) => state.addBid);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:6001/notifications")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to notification hub");

          connection.on("BidPlaced", (bid: Bid) => {
            if (bid.bidStatus.includes("Accepted")) {
              setCurrentPrice(bid.auctionId, bid.amount);
            }
            addBid(bid);
          });

          connection.on("AuctionCreated", (auction: Auction) => {
            if (user?.username !== auction.seller) {
              return toast(<AuctionCreatedToast auction={auction} />, {
                duration: 5000,
              });
            }
          });

          connection.on(
            "AuctionFinished",
            (finishedAuction: AuctionFinished) => {
              const auction = getDetailedViewData(finishedAuction.auctionId);

              return toast.promise(
                auction,
                {
                  loading: "Loading...",
                  success: (auction) => (
                    <AuctionFinishedToast
                      auction={auction}
                      finishedAuction={finishedAuction}
                    />
                  ),
                  error: (err) => "Auction Finished!",
                },
                { duration: 5000, icon: null }
              );
            }
          );
        })
        .catch((err) => console.error(err));

      return () => {
        connection?.off("BidPlaced");
        connection?.off("AuctionCreated");
        connection?.off("AuctionFinished");
        connection?.stop();
      };
    }
  }, [connection, setCurrentPrice]);

  return children;
}
