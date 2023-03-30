import React, { useCallback, useEffect, useRef, useState } from 'react'
import deterministicColor from '../../app/lib/deterministic-color'
import { RolloutSliderProps, Variation } from './types'

const getPercentage = (containerWidth: number, distanceMoved: number) => {
    return (distanceMoved / containerWidth) * 100
}

const limitNumberWithinRange = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max)
}

const nearestN = (N: number, number: number) => Math.ceil(number / N) * N

const VariationSection: React.FC<{
    variation: Variation
    width: number
    onSliderSelect: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    shouldShowThumb: boolean
}> = ({ variation, width, onSliderSelect, shouldShowThumb }) => {
    return (
        <div
            className="variation"
            style={{
                background: deterministicColor(variation.variationKey),
                width: width + '%',
                padding: 20,
                textAlign: 'center',
                position: 'relative',
            }}
        >
            <span style={{ color: 'white', fontWeight: 700, userSelect: 'none', padding: 10 }}>
                {variation.variationKey}
            </span>
            <span
                style={{
                    color: 'white',
                    fontWeight: 700,
                    userSelect: 'none',
                    fontSize: 12,
                    padding: 10,
                }}
            >
                {Math.fround(width) + '%'}
            </span>

            {shouldShowThumb && (
                <div
                    style={{
                        width: '2em',
                        height: '2em',
                        backgroundColor: 'white',
                        position: 'absolute',
                        borderRadius: '2em',
                        right: 'calc(-1.1em)',
                        top: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bottom: 0,
                        margin: 'auto',
                        zIndex: 10,
                        cursor: 'ew-resize',
                        userSelect: 'none',
                    }}
                    onPointerDown={onSliderSelect}
                    className="slider-button"
                >
                    <img src={'https://assets.codepen.io/576444/slider-arrows.svg'} height={'30%'} />
                </div>
            )}
        </div>
    )
}

const RolloutSlider: React.FC<RolloutSliderProps> = ({ data, onChange }) => {
    const [widths, setWidths] = useState<number[]>(data.flatMap(v => v.weight))
    const [variations, setVariations] = useState(data)
    const RolloutSliderRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setVariations(data)
        setWidths(data.flatMap(v => v.weight));
    }, [data])


    return (
        <div>
            <div
                ref={RolloutSliderRef}
                style={{
                    width: '100%',
                    display: 'flex',
                    backgroundColor: 'transparent',
                }}
            >
                {variations.map((variation, index) => (
                    <VariationSection
                        variation={variation}
                        width={widths[index]}
                        key={index}
                        shouldShowThumb={index !== variations.length - 1}
                        onSliderSelect={(e) => {
                            e.preventDefault()
                            document.body.style.cursor = 'ew-resize'

                            const startDragX = e.pageX
                            const sliderWidth = RolloutSliderRef.current?.offsetWidth

                            const resize = (e: MouseEvent & TouchEvent) => {
                                e.preventDefault()
                                const endDragX = e.touches ? e.touches[0].pageX : e.pageX
                                const distanceMoved = endDragX - startDragX
                                const maxPercent = widths[index] + widths[index + 1]

                                const percentageMoved = nearestN(1, getPercentage(sliderWidth, distanceMoved))

                                const _widths = widths.slice()

                                const prevPercentage = _widths[index]
                                const newPercentage = prevPercentage + percentageMoved
                                const currentSectionWidth = Math.round(
                                    limitNumberWithinRange(newPercentage, 0, maxPercent)
                                )
                                _widths[index] = currentSectionWidth

                                const nextSectionIndex = index + 1

                                const nextSectionNewPercentage = _widths[nextSectionIndex] - percentageMoved
                                const nextSectionWidth = Math.round(
                                    limitNumberWithinRange(nextSectionNewPercentage, 0, maxPercent)
                                )
                                _widths[nextSectionIndex] = nextSectionWidth

                                setWidths(_widths)

                                if (onChange) {
                                    const updatedData = variations.map((v, i) => ({
                                        ...v,
                                        weight: _widths[i],
                                    }))
                                    onChange(updatedData)
                                }
                            }

                            window.addEventListener('pointermove', resize)
                            window.addEventListener('touchmove', resize)

                            const removeEventListener = () => {
                                window.removeEventListener('pointermove', resize)
                                window.removeEventListener('touchmove', resize)
                            }

                            const handleEventUp = (e: Event) => {
                                e.preventDefault()
                                document.body.style.cursor = 'initial'
                                removeEventListener()
                            }

                            window.addEventListener('touchend', handleEventUp)
                            window.addEventListener('pointerup', handleEventUp)
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default RolloutSlider
