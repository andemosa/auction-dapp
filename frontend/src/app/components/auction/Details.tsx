"use client";

import { useState } from "react";
import { Clock, Coins, User } from "lucide-react";
import { useAccount, useContractRead } from "@starknet-react/core";
import toast from "react-hot-toast";
import { Contract } from "starknet";

import {
  auctionContractAddress,
  auctionMetadataAbi,
} from "@/app/common/abis/auction-metadata";

const Details = () => {
  const [proposedBid, setProposedBid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const { account } = useAccount();

  const auctionContract = new Contract(
    auctionMetadataAbi,
    auctionContractAddress,
    account,
  );

  const { data: highestBid } = useContractRead({
    abi: auctionMetadataAbi,
    functionName: "get_highest_bid",
    address: auctionContractAddress,
    args: [],
  });

  const { data: owner } = useContractRead({
    abi: auctionMetadataAbi,
    functionName: "get_owner",
    address: auctionContractAddress,
    args: [],
  });

  const { data: highestBidder } = useContractRead({
    abi: auctionMetadataAbi,
    functionName: "get_highest_bidder",
    address: auctionContractAddress,
    args: [],
  });

  const { data: auctionEnd } = useContractRead({
    abi: auctionMetadataAbi,
    functionName: "get_auction_end",
    address: auctionContractAddress,
    args: [],
  });

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proposedBid) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    const bidAmount = parseFloat(proposedBid);

    if (!highestBid || bidAmount <= parseFloat(highestBid.toString())) {
      toast.error("Your bid must be higher than the current bid.");
      return;
    }

    try {
      setIsLoading(true);
      toast.loading("Submitting your bid...");
      await auctionContract.place_bid(bidAmount);
      toast.dismiss();
      toast.success("Bid submitted successfully!");
      setProposedBid("");
      window.location.href = "/";
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to submit bid. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndAuction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (account?.address !== owner) {
      toast.error("Only owner can end auction");
      return;
    }

    try {
      setEndLoading(true);
      toast.loading("Ending auction...");
      await auctionContract.end_auction();
      toast.dismiss();
      toast.success("Auction ended successfully");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to end auction. Please try again.");
    } finally {
      setEndLoading(false);
    }
  };

  const formatTimeRemaining = (endTime: number) => {
    if (!endTime) return "";
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime - now;
    if (timeLeft <= 0) return "Auction Ended";

    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  const shortAddress = (address: string) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <section className="rounded-xl bg-white p-2 shadow-lg sm:p-4 md:p-8">
      <h2 className="mb-6 text-lg font-semibold text-gray-800">
        Auction Contract DAPP
      </h2>
      <div className="mb-8 space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4 md:p-6">
        <p className="flex flex-col gap-3 text-gray-600 md:flex-row md:items-center">
          <span>Contract Address:</span>
          <span className="font-mono md:hidden">
            {shortAddress(auctionContractAddress)}
          </span>
          <span className="hidden font-mono md:inline">
            {auctionContractAddress}
          </span>
        </p>
      </div>
      {account ? (
        <>
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6">
              <label className="mb-2 flex items-center text-sm font-medium text-gray-600">
                <Coins className="mr-2 h-4 w-4 text-green-600" />
                Current Bid
              </label>
              <div className="flex items-baseline">
                <span className="text-lg font-semibold text-green-600 lg:text-xl">
                  {highestBid
                    ? parseFloat(highestBid.toString()).toFixed(2)
                    : ""}
                </span>
                <span className="ml-2 text-sm font-medium text-green-600">
                  ETH
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-red-100 bg-gradient-to-br from-red-50 to-orange-50 p-4 md:p-6">
              <label className="mb-2 flex items-center text-sm font-medium text-gray-600">
                <Clock className="mr-2 h-4 w-4 text-red-500" />
                Time Remaining
              </label>
              <span className="text-lg font-semibold text-red-500 lg:text-xl">
                {formatTimeRemaining(Number(auctionEnd))}
              </span>
            </div>
            <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-4 md:p-6">
              <label className="mb-2 flex items-center text-sm font-medium text-gray-600">
                <User className="mr-2 h-4 w-4 text-blue-500" />
                Highest Bidder
              </label>
              <span className="text-lg font-semibold text-blue-600 lg:text-xl">
                {highestBidder
                  ? shortAddress(`0x${highestBidder?.toString(16)!}`)
                  : ""}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 md:p-6">
              <h3 className="mb-4 text-base font-medium text-gray-700">
                Propose a Bid
              </h3>
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="bid"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Enter Bid (ETH)
                  </label>
                  <input
                    type="number"
                    id="bid"
                    name="bid"
                    min={0.0}
                    value={proposedBid}
                    onChange={(e) => setProposedBid(e.target.value)}
                    placeholder="e.g., 0.1"
                    className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || endLoading}
                  className={`w-full rounded-lg px-4 py-2 text-sm text-white ${
                    isLoading
                      ? "bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isLoading ? "Submitting..." : "Submit Bid"}
                </button>
              </form>
            </div>

            {owner && owner === account?.address ? (
              <div className="flex items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-4 md:p-6">
                <button
                  disabled={isLoading || endLoading}
                  className="rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700"
                  onClick={handleEndAuction}
                >
                  {endLoading ? "Submitting..." : "End Auction"}
                </button>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <h3 className="text-center text-lg font-semibold md:text-xl">
          Connect your wallet to place a bid.
        </h3>
      )}
    </section>
  );
};

export default Details;
