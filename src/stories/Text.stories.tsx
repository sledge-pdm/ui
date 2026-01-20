import { For, type Component } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { fonts } from '../theme/fonts';
import { color } from '../theme/vars';

const ENGLISH_SAMPLE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
const JAPANESE_SAMPLE = `　...よその目には、つまらぬことをこのように騒ぎ立てるのが、実に不思議に思われるかもしれぬ。一杯のお茶でなんという騒ぎだろうというであろうが、考えてみれば、煎（せん）ずるところ人間享楽の茶碗（ちゃわん）は、いかにも狭いものではないか、いかにも早く涙であふれるではないか、無辺を求むる渇（かわき）のとまらぬあまり、一息に飲みほされるではないか。`;
const ASCII_SYMBOLS = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
const UNICODE_SYMBOLS = `°μπΩ±×÷≠??cR??￡?→←↑↓`;
const EMOJI_SYMBOLS = `\u{1F600}\u{1F605}\u{1F9EA}\u{1F9E9}\u2705\u26A0\uFE0F\u{1F4BE}\u{1F5C2}\u{1F4CC}`;

// special values for some fonts
interface FontSpec {
  size?: number;
}
const fontSpecs: Partial<Record<keyof typeof fonts, FontSpec>> = {
  ZFB19: {
    size: 14,
  },
  ZFB25: {
    size: 12,
  },
  ZFB31: {
    size: 12,
  },
  k8x12: {
    size: 12,
  },
  k8x12L: {
    size: 12,
  },
  k8x12S: {
    size: 12,
  },
  PM10: {
    size: 10,
  },
  PM12: {
    size: 12,
  },
  Terminus: {
    size: 11,
  },
};

interface TextArgs {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  lineThrough: boolean;
}

const TextStory: Component<TextArgs> = (props) => {
  const textClassList = () => ({
    'text-bold': props.bold,
    'text-italic': props.italic,
    'text-underline': props.underline && !props.lineThrough,
    'text-line-through': props.lineThrough && !props.underline,
    'text-underline-line-through': props.underline && props.lineThrough,
  });

  return (
    <div style={{ display: 'flex', 'flex-direction': 'row', 'flex-wrap': 'wrap', width: '100%', gap: '36px 24px', 'overflow-y': 'auto' }}>
      <style>{`
        .text-bold { font-weight: bold; }
        .text-italic { font-style: italic; }
        .text-underline { text-decoration: underline; }
        .text-line-through { text-decoration: line-through; }
        .text-underline-line-through { text-decoration: underline line-through; }
      `}</style>
      <For each={Object.entries(fonts)}>
        {([key, font]) => {
          const specs: FontSpec = fontSpecs[key as keyof typeof fonts] ?? {};
          const size = specs?.size ?? 8;
          const baseTextStyle = {
            'font-family': font,
            'font-size': `${size}px`,
          };

          return (
            <div
              style={{
                width: '500px',
                'overflow-wrap': 'break-word',
                display: 'flex',
                'flex-direction': 'column',
                gap: '4px',
                'user-select': 'text',
              }}
            >
              <p style={{ 'font-family': font, 'font-size': `${size * 2}px`, 'margin-bottom': '6px' }}>
                {key}
                <span style={{ 'font-family': fonts.ZFB08, 'font-size': `8px`, 'margin-left': '8px', color: color.muted }}>({size}px)</span>
              </p>
              <p style={baseTextStyle} classList={textClassList()}>
                {ENGLISH_SAMPLE}
              </p>
              <p style={baseTextStyle} classList={textClassList()}>
                {JAPANESE_SAMPLE}
              </p>
              <p style={baseTextStyle} classList={textClassList()}>
                {ASCII_SYMBOLS}
              </p>
              <p style={baseTextStyle} classList={textClassList()}>
                {UNICODE_SYMBOLS}
              </p>
              <p style={baseTextStyle} classList={textClassList()}>
                {EMOJI_SYMBOLS}
              </p>
            </div>
          );
        }}
      </For>
    </div>
  );
};

const meta: Meta = {
  title: 'Text/Fonts',
  component: TextStory,
  argTypes: {
    bold: { control: 'boolean' },
    italic: { control: 'boolean' },
    underline: { control: 'boolean' },
    lineThrough: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    bold: false,
    italic: false,
    underline: false,
    lineThrough: false,
  },
};
