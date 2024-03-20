import { createWithEqualityFn } from "zustand/traditional"

type State = {
    pageNumber: number
    pageSize: number
    pageCount: number
    searchTerm: string
    searchValue: string
}

type Actions = {
    setParams: (params: Partial<State>) => void
    setSearchValue: (value: string) => void
    reset: () => void
}

const initialState = {
    pageNumber: 1,
    pageSize: 12,
    pageCount: 1,
    searchTerm: '',
    searchValue: ''
}

export const useParamStore = createWithEqualityFn<State & Actions>()((set) => ({
    ...initialState,
    setParams: (newParams: Partial<State>) => {
        set((state) => {
            if( newParams.pageNumber ) {
                return {...state, pageNumber: newParams.pageNumber}
            } else {
                return {...state, ...newParams, pageNumber: 1}
            }
        })
    },
    reset: () => set(initialState),
    setSearchValue: (value: string) => set({searchValue: value})
}))
