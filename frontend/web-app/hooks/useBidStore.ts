import { Bid } from "@/types"
import { createWithEqualityFn } from "zustand/traditional"


type State = {
    bids: Bid[]
    open: boolean
}

type Actions = {
    setBids: (bids: Bid[]) => void
    addBid: (bid: Bid) => void
    setOpen: (value: boolean) => void
}

export const useBidStore = createWithEqualityFn<State & Actions>((set) => ({
    bids: [],
    open: true,

    setBids: (bids: Bid[]) => {
        set(() => ({ 
            bids 
        }))
    },
    addBid: (bid: Bid) => {
        set((state) => ({
            bids: state.bids.find((b) => b.id === bid.id) ? [...state.bids] : [bid, ...state.bids ]
        }))
    },
    setOpen: (value: boolean) => {
        set(() => ({
            open: value
        }))
    }
}))

