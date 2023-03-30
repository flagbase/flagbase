
export type Variation = {
    variationKey: string
    weight: number
}

export type RolloutSliderProps = {
    data: Variation[]
    onChange?: (data: Variation[]) => void
}