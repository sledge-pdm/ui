import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Button from '../components/Button';
import Dropdown, { type DropdownOption } from '../components/control/Dropdown';
import RadioButton from '../components/control/RadioButton';
import ToggleSwitch from '../components/control/ToggleSwitch';
import FoldBox from '../components/FoldBox';
import Nothing from '../components/Nothing';

const meta: Meta<typeof FoldBox> = {
  title: 'Components/FoldBox',
  component: FoldBox,
};

export default meta;
type Story = StoryObj<typeof FoldBox>;

const DropdownOptions: DropdownOption<string>[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

export const Basic: Story = {
  render: () => {
    return (
      <div
        style={{
          width: '500px',
        }}
      >
        <FoldBox title='options.' defaultOpen>
          <div
            style={{
              display: 'flex',
              'flex-direction': 'column',
              gap: '8px',
            }}
          >
            <p>push this</p>
            <Button>dont push me!!</Button>

            <div style={{ margin: '8px' }}>
              <Dropdown options={DropdownOptions} value={DropdownOptions[0].value} />
            </div>

            <p>more options.</p>
            <div
              style={{
                display: 'flex',
                'flex-direction': 'column',
                gap: '8px',
                margin: '8px ',
              }}
            >
              <RadioButton label='Toggle ME' />
              <ToggleSwitch checked>no no toggle me instead</ToggleSwitch>
            </div>
            <FoldBox title='more hidden options.'>
              <div
                style={{
                  display: 'flex',
                  'flex-direction': 'column',
                  gap: '12px',
                }}
              >
                <Nothing>but nothing's there...</Nothing>
                <FoldBox title='more and more hidden options.'>
                  <p>Bruhhhhhhhhhhhhhhhhhhhhh!</p>
                </FoldBox>
              </div>
            </FoldBox>
          </div>
        </FoldBox>
      </div>
    );
  },
};
