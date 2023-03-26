import React, { useState, useEffect, useCallback } from 'react'

type Variation = {
    variationKey: string
    weight: number
}

type RolloutSliderProps = {
    data: Variation[]
    maxValue: number
    onChange?: (data: Variation[]) => void
}

const generateColor = (key: string): string => {
    const colors = ['#9FE2BF', '#40E0D0', '#6495ED', '#FFBF00', '#96DED1', '#87CEEB', '#F4BB44']
    let sum = 0
    for (let i = 0; i < key.length; i++) {
        sum += key.charCodeAt(i)
    }
    return colors[sum % colors.length]
}

const RolloutSlider: React.FC<RolloutSliderProps> = ({ data, maxValue, onChange }) => {
    const [weights, setWeights] = useState(data)
    console.log('weights', weights)
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
                onChange && onChange(updatedWeights)
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
                            <svg
                                className="w-6 h-6 mr-3"
                                style={{ color: generateColor(item.variationKey) }}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                />
                            </svg>
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
                    <th className="flex flex-row items-center">
                        <svg
                            className="w-6 h-6 mr-3 text-gray-900"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                            />
                        </svg>
                        <div className="uppercase font-bold">Total</div>
                    </th>
                    <th style={{ width: '70px', color: borderColor }}>
                        <input
                            type="number"
                            value={totalWeight}
                            style={{
                                border: 0,
                                height: '25px',
                                width: '50px',
                                margin: '0px',
                                WebkitAppearance: 'none',
                                MozAppearance: 'textfield',
                                appearance: 'textfield',
                                fontWeight: 'normal',
                            }}
                            disabled
                        />
                        %
                    </th>
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
