import { UserGroupIcon, UsersIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect, useCallback } from 'react';
import deterministicColor from '../../app/lib/deterministic-color';
import { RolloutSliderProps } from './types';

const MAX_RANGE = 100;

const RolloutSlider: React.FC<RolloutSliderProps> = ({ data, onChange }) => {
    const [weights, setWeights] = useState(data);
    const [borderColor, setBorderColor] = useState('red');

    useEffect(() => {
        const totalWeight = weights.reduce((acc, item) => acc + item.weight, 0);
        setBorderColor(totalWeight === MAX_RANGE ? 'green' : 'red');
    }, [data]);

    useEffect(() => {
        setWeights(data);
    }, [data])

    const handleWeightChange = useCallback(
        (index: number, newWeight: number) => {
          if (newWeight < 0) {
            return;
          }
      
          const updatedWeights = weights.map((item, idx) => {
            if (idx === index) {
              return { ...item, weight: newWeight };
            }
            return item;
          });
      
          const totalWeight = updatedWeights.reduce((acc, item) => acc + item.weight, 0);
          if (totalWeight <= MAX_RANGE) {
            setWeights(updatedWeights)
            if (onChange) {
                onChange(updatedWeights);
            }
        },
        [data, MAX_RANGE, onChange]
      );
      
    const totalWeight = weights.reduce((acc, item) => acc + item.weight, 0);

    return (
        <div>
            <table width={512}>
                {weights.map((item, index) => (
                    <tr key={item.variationKey}>
                        <td className="flex flex-row">
                            <UsersIcon
                                className={`w-6 h-6 mr-3`}
                                style={{
                                    color: deterministicColor(item.variationKey),
                                }}
                            />
                            <div className="uppercase font-bold">{item.variationKey} %</div>
                        </td>
                        <td>
                            <input
                                type="number"
                                value={item.weight}
                                style={{
                                    border: 0,
                                    height: '25px',
                                    width: '70px',
                                    margin: '0px',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'textfield',
                                    appearance: 'textfield',
                                }}
                                onChange={(e) => handleWeightChange(index, parseInt(e.target.value))}
                            />
                        </td>
                        <td>
                            <input
                                type="range"
                                value={item.weight}
                                style={{
                                    appearance: 'none',
                                    height: '25px',
                                    width: 'MAX_RANGE%',
                                    margin: '0px',
                                    background: `linear-gradient(to right, ${deterministicColor(
                                        item.variationKey
                                    )}, ${deterministicColor(item.variationKey)}) no-repeat left`,
                                    backgroundSize: `${(item.weight / totalWeight) * totalWeight}% MAX_RANGE%`,
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
                        <UserGroupIcon className="w-6 h-6 mr-3" />
                        <div className="uppercase font-bold">Total %</div>
                    </th>
                    <th style={{ width: '70px', color: borderColor }}>
                        <input
                            type="number"
                            value={totalWeight}
                            style={{
                                border: 0,
                                height: '25px',
                                width: '70px',
                                margin: '0px',
                                WebkitAppearance: 'none',
                                MozAppearance: 'textfield',
                                appearance: 'textfield',
                                fontWeight: 'normal',
                            }}
                            disabled
                        />
                    </th>
                    <th>
                        <div style={{ display: 'flex', height: '25px', borderWidth: 2, borderColor }}>
                            {weights.map((item) => (
                                <div
                                    key={item.variationKey}
                                    style={{
                                        backgroundColor: deterministicColor(item.variationKey),
                                        flexBasis: `${(item.weight / MAX_RANGE) * MAX_RANGE}%`,
                                    }}
                                />
                            ))}
                        </div>
                    </th>
                </tr>
            </table>
        </div>
    );
};

export default RolloutSlider;
