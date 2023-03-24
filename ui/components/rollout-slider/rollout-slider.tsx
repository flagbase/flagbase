import React, { useState, useEffect, useCallback } from 'react'

type Variation = {
    variationKey: string
    weight: number
}

type RolloutSliderProps = {
    data: Variation[]
    maxValue: number,
    onChange?: (data: Variation[]) => void
}

const generateColor = (key: string): string => {
    const colors = [
        '#9FE2BF',
        '#40E0D0',
        '#6495ED',
        '#FFBF00',
        '#96DED1',
        '#87CEEB',
        '#F4BB44'
    ]
    let sum = 0
    for (let i = 0; i < key.length; i++) {
        sum += key.charCodeAt(i)
    }
    return colors[sum % colors.length]
}

const RolloutSlider: React.FC<RolloutSliderProps> = ({ data, maxValue, onChange }) => {
    const [weights, setWeights] = useState(data)
    const [borderColor, setBorderColor] = useState('red')

    useEffect(() => {
        const totalWeight = weights.reduce((acc, item) => acc + item.weight, 0)
        setBorderColor(totalWeight === maxValue ? 'green' : 'red')
    }, [weights, maxValue])

    const handleWeightChange = useCallback(
        (index: number, newWeight: number) => {
            if (newWeight < 0) {
                return
            }

            const updatedWeights = weights.map((item, idx) => {
                if (idx === index) {
                    return { ...item, weight: newWeight }
                }
                return item
            })

            const totalWeight = updatedWeights.reduce((acc, item) => acc + item.weight, 0)
            if (totalWeight <= maxValue) {
                setWeights(updatedWeights)
                onChange && onChange(updatedWeights);
            }
        },
        [weights, maxValue, onChange]
    )

    const totalWeight = weights.reduce((acc, item) => acc + item.weight, 0)

    return (
        <div>
            <table width={512}>
                {weights.map((item, index) => (
                    <tr key={item.variationKey}>
                        <td className="flex flex-row">
                            <div
                                className="text-xs text-white px-3 py-1 mr-3 rounded-full"
                                style={{ backgroundColor: generateColor(item.variationKey) }}
                            ></div>
                            <div className="uppercase font-bold">{item.variationKey}</div>
                        </td>
                        <td>
                            <input
                                type="number"
                                value={item.weight}
                                style={{
                                    border: 0,
                                    height: '25px',
                                    width: '50px',
                                    margin: '0px',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'textfield',
                                    appearance: 'textfield',
                                }}
                                onChange={(e) => handleWeightChange(index, parseInt(e.target.value))}
                            />
                            %
                        </td>
                        <td>
                            <input
                                type="range"
                                value={item.weight}
                                style={{
                                    appearance: 'none',
                                    height: '25px',
                                    width: '100%',
                                    margin: '0px',
                                    background: `linear-gradient(to right, ${generateColor(
                                        item.variationKey
                                    )}, ${generateColor(item.variationKey)}) no-repeat left`,
                                    backgroundSize: `${(item.weight / totalWeight) * totalWeight}%`,
                                    WebkitAppearance: 'none',
                                    borderRadius: '0px',
                                    cursor: 'pointer',
                                }}
                                onChange={(e) => handleWeightChange(index, parseInt(e.target.value))}
                            />
                        </td>
                    </tr>
                ))}
                <tr>
                    <th>
                        <code className={`${totalWeight === maxValue ? 'text-white text-opacity-0' : 'text-red-600'}`}>
                            Total is not 100%
                        </code>
                    </th>
                    <th style={{ width: '70px' }}></th>
                    <th>
                        <div style={{ display: 'flex', height: '25px', borderWidth: 2, borderColor }}>
                            {weights.map((item) => (
                                <div
                                    key={item.variationKey}
                                    style={{
                                        backgroundColor: generateColor(item.variationKey),
                                        flexBasis: `${(item.weight / maxValue) * 100}%`,
                                    }}
                                />
                            ))}
                        </div>
                    </th>
                </tr>
            </table>
        </div>
    )
}

export default RolloutSlider
