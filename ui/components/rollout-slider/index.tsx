import React from 'react'
import RolloutSliderExisting from './rollout-slider-existing'
import RolloutSliderNew from './rollout-slider-new'
import { useFeatureFlag } from '@flagbase/react-client-sdk'
import { RolloutSliderProps } from './types'

const RolloutSlider: React.FC<RolloutSliderProps> = (props) => {
    const showRolloutSlider = useFeatureFlag('rollout-slider', 'control')

    return showRolloutSlider === 'treatment' ? (
        <RolloutSliderNew {...props} />
    ) : (
        <RolloutSliderExisting {...props} />
    )
}

export default RolloutSlider;