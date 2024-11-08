import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ChatMainLayout from './ChatMainLayout';

const meta: Meta<typeof ChatMainLayout> = {
  component: ChatMainLayout,
  title: 'Layout/ChatMainLayout'
};

export default meta;

type Story = StoryObj<typeof ChatMainLayout>;

export const Default: Story = {
  args: {
    dropdownContent: (
      <>
        <p>Menu item 1</p>
        <p>Menu item 2</p>
      </>
    ),
    mainContent: <div>Main content goes here</div>
  }
};

export const CustomDropdown: Story = {
  args: {
    dropdownContent: (
      <>
        <p>Custom item 1</p>
        <p>Custom item 2</p>
        <p>Custom item 3</p>
      </>
    ),
    mainContent: <div>Custom main content</div>
  }
};
