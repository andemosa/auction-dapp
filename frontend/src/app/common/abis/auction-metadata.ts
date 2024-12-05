import { Abi } from "starknet";

export const auctionContractAddress =
  "0x03fb365b4cfc33f4c7a247633aeb14798becbd5403b9b158b68ab14f9c06c5f2";

export const auctionMetadataAbi: Abi = [
  {
    name: "AuctionImpl",
    type: "impl",
    interface_name: "auction_contract::IAuction",
  },
  {
    name: "auction_contract::IAuction",
    type: "interface",
    items: [
      {
        name: "place_bid",
        type: "function",
        inputs: [
          {
            name: "bid_amount",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "end_auction",
        type: "function",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        name: "get_highest_bidder",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_owner",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_nft_contract",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_highest_bid",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "get_auction_end",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    name: "constructor",
    type: "constructor",
    inputs: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "initial_price",
        type: "core::integer::u64",
      },
      {
        name: "duration",
        type: "core::integer::u64",
      },
      {
        name: "nft_contract",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "struct",
    name: "auction_contract::Auction::BidPlaced",
    type: "event",
    members: [
      {
        kind: "data",
        name: "bidder",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "amount",
        type: "core::integer::u64",
      },
    ],
  },
  {
    kind: "struct",
    name: "auction_contract::Auction::AuctionEnded",
    type: "event",
    members: [
      {
        kind: "data",
        name: "winner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "amount",
        type: "core::integer::u64",
      },
    ],
  },
  {
    kind: "enum",
    name: "auction_contract::Auction::Event",
    type: "event",
    variants: [
      {
        kind: "nested",
        name: "BidPlaced",
        type: "auction_contract::Auction::BidPlaced",
      },
      {
        kind: "nested",
        name: "AuctionEnded",
        type: "auction_contract::Auction::AuctionEnded",
      },
    ],
  },
];
