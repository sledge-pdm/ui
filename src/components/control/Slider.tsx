import { type Component, createEffect, createMemo, createSignal, onCleanup, onMount, Show } from 'solid-js';
import '../../styles/Slider.css';
import type { LabelMode } from '../../types';

interface SliderProps {
  // style
  orientation?: 'horizontal' | 'vertical';
  labelMode: LabelMode;
  labelWidth?: number;
  labelGap?: number;
  title?: string;
  customFormat?: (value: number) => string;
  // values
  value?: number;
  defaultValue?: number;
  min: number;
  max: number;
  allowFloat?: boolean;
  floatSignificantDigits?: number;
  // behaviour
  allowButtons?: number;
  allowDirectInput?: boolean;
  dblClickResetValue?: number;
  wheelSpin?: boolean;
  wheelStep?: number;
  // events
  onChange?: (newValue: number) => void;
  onDoubleClick?: () => void;
  onPointerDownOnValidArea?: (e: PointerEvent | MouseEvent) => boolean;
}

const Slider: Component<SliderProps> = (props) => {
  let labelRef: HTMLDivElement;
  let directInputRef: HTMLInputElement;
  let sliderRef: HTMLDivElement;
  let sliderRect: DOMRect | undefined;
  let isDragListening = false;

  const isVertical = createMemo<boolean>(() => props.orientation === 'vertical');
  const allowButtons = createMemo(() => props.allowButtons ?? 1);
  const isAllowedClickButton = (e: MouseEvent) => (allowButtons() & (1 << e.button)) !== 0;

  const [directInputMode, setDirectInputMode] = createSignal(false);

  const [value, setValue] = createSignal(props.defaultValue ?? props.min);
  createEffect(() => {
    if (props.value !== undefined) setValue(props.value);
  });

  const getFormattedValue = (value: number): string => {
    return props.customFormat ? props.customFormat(value) : `${value}`;
  };

  const toPercent = (value: number) => {
    if (props.min === props.max) return 100;
    return ((value - props.min) / (props.max - props.min)) * 100;
  };

  const [isDrag, setDrag] = createSignal(false);
  const percent = createMemo(() => toPercent(value()));

  const update = (newValue: number) => {
    newValue = getFixedValue(newValue);
    setValue(newValue);
    props.onChange?.(newValue);
  };

  const onPointerDownOnValidArea = (e: PointerEvent | MouseEvent): boolean => {
    if (props.onPointerDownOnValidArea) {
      return props.onPointerDownOnValidArea(e);
    }
    return true;
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (isAllowedClickButton(e) && onPointerDownOnValidArea(e)) {
      setDrag(true);
      sliderRect = sliderRef?.getBoundingClientRect();
      if (!isDragListening) {
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', cancelHandling);
        document.addEventListener('pointercancel', cancelHandling);
        isDragListening = true;
      }
    } else {
      setDrag(false);
      sliderRect = undefined;
      if (isDragListening) {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', cancelHandling);
        document.removeEventListener('pointercancel', cancelHandling);
        isDragListening = false;
      }
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!sliderRef || !isDrag()) return;

    const rect = sliderRect ?? sliderRef.getBoundingClientRect();
    let raw: number;
    if (isVertical()) {
      const { top, height } = rect;
      // 上を max, 下を min にする (一般的 UI)。逆にしたい場合は (1 - posRatio)
      let pos = Math.max(0, Math.min(e.clientY - top, height));
      const posRatio = 1 - pos / height; // 上=1 下=0
      raw = props.min + posRatio * (props.max - props.min);
    } else {
      const { left, width } = rect;
      let pos = Math.max(0, Math.min(e.clientX - left, width));
      raw = props.min + (pos / width) * (props.max - props.min);
    }
    update(raw);
  };

  const cancelHandling = () => {
    setDrag(false);
    sliderRect = undefined;
    if (isDragListening) {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', cancelHandling);
      document.removeEventListener('pointercancel', cancelHandling);
      isDragListening = false;
    }
  };

  const onLineClick = (e: MouseEvent) => {
    const isAllowedButton = isAllowedClickButton(e);
    const shouldStartDrag = onPointerDownOnValidArea(e);
    if (!sliderRef || !isAllowedButton || !shouldStartDrag) return;
    const rect = sliderRef.getBoundingClientRect();
    let raw: number;
    if (isVertical()) {
      const { top, height } = rect;
      let pos = Math.max(0, Math.min(e.clientY - top, height));
      const posRatio = 1 - pos / height;
      raw = props.min + posRatio * (props.max - props.min);
    } else {
      const { left, width } = rect;
      let pos = Math.max(0, Math.min(e.clientX - left, width));
      raw = props.min + (pos / width) * (props.max - props.min);
    }
    update(raw);
  };

  const getFixedValue = (raw: number | string): number => {
    if (typeof raw === 'string') raw = Number(raw);
    if (isNaN(raw)) return props.defaultValue ?? props.min;
    let newValue;
    if (props.allowFloat) {
      if (props.floatSignificantDigits) {
        // allowFloat+floatSignificantDigits: keep float + significant digits w/toFixed
        newValue = parseFloat(raw.toFixed(props.floatSignificantDigits));
      } else {
        // allowFloat: keep float
        newValue = raw;
      }
    } else {
      // round float to int
      newValue = Math.round(raw);
    }
    // clamp value
    newValue = Math.max(props.min, Math.min(newValue, props.max));
    return newValue;
  };

  const resetHandlePercent = createMemo(() => {
    if (props.dblClickResetValue === undefined) return undefined;
    const fixed = getFixedValue(props.dblClickResetValue);
    return toPercent(fixed);
  });

  const handleClickOutside = (e: MouseEvent) => {
    if (directInputMode() && labelRef && !labelRef.contains(e.target as Node)) {
      update(getFixedValue(directInputRef.value));
      setDirectInputMode(false);
    }
  };

  const cancelDirectInput = () => {
    setDirectInputMode(false);
  };

  const handleOnWheel = (e: WheelEvent) => {
    if (props.wheelSpin) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const step = props.wheelStep ?? 1;
      const delta = e.deltaY < 0 ? step : -step;
      // 縦方向はホイールの方向と intuitive に一致: 上スクロール(negative deltaY) => 値増加
      const newValue = value() + delta;
      update(newValue);
    }
  };

  const handleDoubleClick = () => {
    if (props.dblClickResetValue !== undefined) {
      update(props.dblClickResetValue);
    } else if (props.defaultValue !== undefined) {
      update(props.defaultValue);
    }

    props.onDoubleClick?.();
  };

  const renderResetHandle = () => {
    const percent = resetHandlePercent();
    if (percent === undefined) return null;
    const style = isVertical() ? { bottom: `${percent}%`, opacity: 0.5 } : { left: `${percent}%`, opacity: 0.5 };
    return <div style={style} class={isVertical() ? 'slider-handle-vertical' : 'slider-handle'} />;
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });
  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
    if (isDragListening) {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', cancelHandling);
      document.removeEventListener('pointercancel', cancelHandling);
      isDragListening = false;
    }
  });

  const labelArea = (
    <div
      ref={(el) => (labelRef = el)}
      class='slider-label-container'
      onWheel={handleOnWheel}
      title={props.title}
      style={
        isVertical()
          ? {
              height: props.labelWidth ? `${props.labelWidth}px` : undefined,
              'min-height': props.labelWidth ? undefined : 'fit-content',
            }
          : {
              width: props.labelWidth ? `${props.labelWidth}px` : undefined,
              'min-height': props.labelWidth ? undefined : 'fit-content',
            }
      }
    >
      <Show
        when={props.allowDirectInput && directInputMode()}
        fallback={
          <p
            class='slider-label'
            onClick={(e) => {
              if (!props.allowDirectInput) return;
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              setDirectInputMode(true);
              directInputRef?.select();
            }}
            style={{ 'writing-mode': isVertical() ? 'vertical-rl' : undefined }}
          >
            {getFormattedValue(value())}
          </p>
        }
      >
        <input
          class='slider-label-input'
          ref={(el) => (directInputRef = el)}
          onSubmit={(e) => {
            setDirectInputMode(false);
          }}
          onFocusOut={cancelDirectInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              update(getFixedValue(directInputRef.value));
              setDirectInputMode(false);
            }
          }}
          value={value()}
          type={'number'}
          style={{ 'writing-mode': isVertical() ? 'vertical-rl' : undefined }}
        />
      </Show>
    </div>
  );

  return (
    <div
      class={isVertical() ? 'slider-root-vertical' : 'slider-root'}
      style={{
        gap: props.labelGap ? `${props.labelGap}px` : '8px',
      }}
    >
      <Show when={props.labelMode === 'left'}>{labelArea}</Show>

      <div
        class={isVertical() ? 'slider-vertical' : 'slider'}
        ref={(el) => (sliderRef = el)}
        onPointerDown={handlePointerDown}
        onDblClick={handleDoubleClick}
        onClick={onLineClick}
      >
        <div class={isVertical() ? 'slider-line-hitbox-vertical' : 'slider-line-hitbox'} onWheel={handleOnWheel}>
          <div class={isVertical() ? 'slider-line-vertical' : 'slider-line'} />
        </div>
        {renderResetHandle()}
        {isVertical() ? (
          <div style={{ bottom: `${percent()}%` }} class='slider-handle-vertical' />
        ) : (
          <div style={{ left: `${percent()}%` }} class='slider-handle' />
        )}
      </div>

      <Show when={props.labelMode === 'right'}>{labelArea}</Show>
    </div>
  );
};

export default Slider;
