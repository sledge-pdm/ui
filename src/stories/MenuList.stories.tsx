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

const keyboardOptions: MenuListOption[] = [
  { type: 'label', label: 'Actions' },
  { type: 'item', label: 'Add' },
  { type: 'item', label: 'Disabled', disabled: true },
  { type: 'divider', label: '' },
  { type: 'item', label: 'Delete', color: 'var(--color-error)' },
];

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

const pressKey = (key: string) => {
  const target = document.activeElement;
  if (!(target instanceof HTMLElement)) throw new Error(`Nothing was focused when pressing ${key}`);
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

const focusedMenuIndex = () => {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return undefined;
  return active.dataset.menuIndex;
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [open, setOpen] = createSignal(false);
    const [message, setMessage] = createSignal('Select an item');
    const withActions = keyboardOptions.map((opt) =>
      opt.type === 'item'
        ? {
            ...opt,
            onSelect: () => setMessage(`Selected: ${opt.label}`),
          }
        : opt
    );
    return (
      <div style={{ display: 'flex', gap: '16px', 'align-items': 'flex-start' }}>
        <button data-testid='menu-trigger' type='button' onClick={() => setOpen(true)}>
          open menu
        </button>
        {open() && (
          <MenuList
            options={withActions}
            closeByOutsideClick={false}
            focusOnMount
            onClose={() => setOpen(false)}
            style={{ position: 'relative', top: '0', left: '0' }}
          />
        )}
        <p style={{ 'min-width': '160px' }}>{message()}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-testid="menu-trigger"]');
    if (!(trigger instanceof HTMLButtonElement)) throw new Error('Trigger was not rendered');

    trigger.focus();
    trigger.click();
    await tick();

    const menu = canvasElement.querySelector('.menu');
    if (!(menu instanceof HTMLElement)) throw new Error('Menu was not rendered');
    if (document.activeElement !== menu) throw new Error('focusOnMount did not move focus to the menu');

    // divider / label / disabled は飛ばして、選択できる項目だけを辿る
    pressKey('ArrowDown');
    if (focusedMenuIndex() !== '1') throw new Error(`ArrowDown did not focus the first item (got ${focusedMenuIndex()})`);

    pressKey('ArrowDown');
    if (focusedMenuIndex() !== '4') throw new Error(`ArrowDown did not skip the disabled item and divider (got ${focusedMenuIndex()})`);

    pressKey('ArrowDown');
    if (focusedMenuIndex() !== '1') throw new Error(`ArrowDown did not wrap to the first item (got ${focusedMenuIndex()})`);

    pressKey('ArrowUp');
    if (focusedMenuIndex() !== '4') throw new Error(`ArrowUp did not wrap to the last item (got ${focusedMenuIndex()})`);

    pressKey('Home');
    if (focusedMenuIndex() !== '1') throw new Error(`Home did not focus the first item (got ${focusedMenuIndex()})`);

    pressKey('End');
    if (focusedMenuIndex() !== '4') throw new Error(`End did not focus the last item (got ${focusedMenuIndex()})`);

    pressKey('Enter');
    await tick();

    const message = canvasElement.querySelector('p');
    if (message?.textContent !== 'Selected: Delete') throw new Error(`Enter did not run the focused item (got ${message?.textContent})`);
    if (canvasElement.querySelector('.menu')) throw new Error('Menu stayed open after the item was selected');
    if (document.activeElement !== trigger) throw new Error('Focus was not restored to the caller after the menu closed');
  },
};
