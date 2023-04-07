import React from 'react';
import { Story, Meta } from '@storybook/react';
import { colors } from '../../styles';
import styled from '@emotion/styled';

export default {
  title: 'Theme/Colors',
} as Meta;

const ColorTile = styled.div`
  width: 100px;
  height: 100px;
  margin: 10px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Template: Story = () => {
  const colorNames = Object.keys(colors);
  const colorTiles = colorNames.map((color) => (
    <ColorTile key={color} style={{ backgroundColor: colors[color] }}>
      {color}
    </ColorTile>
  ));
  return <div>{colorTiles}</div>;
};

export const Default = Template.bind({});
Default.args = {
  text: 'Hello there. General kenobi!!',
};
