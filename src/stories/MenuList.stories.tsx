import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { MenuList, type MenuListOption } from '../components/MenuList';

const meta: Meta<typeof MenuList> = {
  title: 'Components/MenuList',
  component: MenuList,
};

export default meta;
type Story = StoryObj<typeof MenuList>;

const options: MenuListOption[] = [
  { type: 'label', label: 'Actions' },
  { type: 'item', label: 'Add' },
  { type: 'item', label: 'Edit' },
  { type: 'item', label: 'Delete', color: 'var(--color-error)' },
  { type: 'divider', label: '' },
  { type: 'label', label: 'Actions 2' },
  { type: 'item', label: 'Copy' },
  { type: 'item', label: 'Cut' },
  { type: 'item', label: 'Paste' },
  { type: 'divider', label: '' },
  { type: 'label', label: '日本語アクション' },
  { type: 'item', label: 'にほんご' },
];

export const Basic: Story = {
  render: () => {
    const [message, setMessage] = createSignal('Select an item');
    const withActions = options.map((opt) =>
      opt.type === 'item'
        ? {
            ...opt,
            onSelect: () => setMessage(`Selected: ${opt.label}`),
          }
        : opt
    );
    return (
      <div style={{ display: 'flex', gap: '16px', 'align-items': 'flex-start' }}>
        <MenuList options={withActions} closeByOutsideClick={false} style={{ position: 'relative', top: '0', left: '0' }} />
        <p style={{ 'min-width': '160px' }}>{message()}</p>
      </div>
    );
  },
};

const optionsLong: MenuListOption[] = [
  { type: 'label', label: 'Actions' },
  { type: 'item', label: 'Add' },
  { type: 'item', label: 'Edit' },
  { type: 'label', label: 'HyperLongLabelThatExceedsWidthLimit' },
  { type: 'item', label: 'ThisIsTooLongItemThatContainsTextWhichMayOverflowLayoutWidthYes' },
  { type: 'item', icon: '/assets/icons/actions/image.png', label: 'ThisIsTooLongItemWithIconThatContainsTextWhichMayOverflowLayoutWidth' },
];
export const LongText: Story = {
  render: () => {
    const [message, setMessage] = createSignal('Select an item');
    const withActions = optionsLong.map((opt) =>
      opt.type === 'item'
        ? {
            ...opt,
            onSelect: () => setMessage(`Selected: ${opt.label}`),
          }
        : opt
    );
    return (
      <div style={{ display: 'flex', gap: '16px', 'align-items': 'flex-start' }}>
        <MenuList options={withActions} closeByOutsideClick={false} style={{ position: 'relative', top: '0', left: '0', 'max-width': '200px' }} />
        <p style={{ 'min-width': '160px' }}>{message()}</p>
      </div>
    );
  },
};
