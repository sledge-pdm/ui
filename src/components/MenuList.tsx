import { clsx } from '@sledge-pdm/core';
import { type Component, For, type JSX, onCleanup, onMount, Show } from 'solid-js';
import '../styles/MenuList.css';
import { color } from '../theme/vars';
import Icon from './Icon';
import Nothing from './Nothing';

const menuDirection = {
  down: 'menu-dir-down',
  up: 'menu-dir-up',
} as const;

export interface MenuListOption {
  type: 'item' | 'label' | 'divider';
  icon?: string; // 8x8
  title?: string;
  label: string;
  disabled?: boolean;
  color?: string;
  fontFamily?: string;
  onSelect?: () => void;
  retainAfterSelect?: boolean;
}

export type MenuListAppearance = 'simple' | 'emphasis';

interface Props extends Omit<JSX.HTMLAttributes<HTMLUListElement>, 'onClick'> {
  appearance?: MenuListAppearance;
  options: MenuListOption[];
  align?: 'left' | 'right'; // メニューの配置
  menuDir?: 'down' | 'up';
  closeByOutsideClick?: boolean; // メニュー外クリックで閉じるかどうか
  focusOnMount?: boolean; // 表示時にメニューへフォーカスを移し、閉じるときに元の要素へ戻すかどうか
  onClose?: () => void; // メニューが閉じるときのコールバック
}

export const MenuList: Component<Props> = (props) => {
  let containerRef: HTMLUListElement | undefined;
  const dir = props.menuDir ?? 'down';

  // フォーカスを戻す先。focusOnMount のときだけ記録する
  let focusOrigin: HTMLElement | undefined;
  // キーボード操作の現在位置。options 上の index で、label/divider/disabled は対象外
  let activeIndex = -1;

  const isSelectable = (option?: MenuListOption) => option?.type === 'item' && !option.disabled;
  const selectableIndices = () =>
    props.options.reduce<number[]>((acc, option, index) => {
      if (isSelectable(option)) acc.push(index);
      return acc;
    }, []);

  const focusItem = (index: number) => {
    const el = containerRef?.querySelector<HTMLElement>(`[data-menu-index="${index}"]`);
    if (!el) return;
    activeIndex = index;
    el.focus();
  };

  const moveFocus = (delta: 1 | -1) => {
    const indices = selectableIndices();
    if (indices.length === 0) return;
    const current = indices.indexOf(activeIndex);
    // 未選択の状態からは、下キーで先頭・上キーで末尾に入る
    const next = current === -1 ? (delta === 1 ? 0 : indices.length - 1) : (current + delta + indices.length) % indices.length;
    focusItem(indices[next]);
  };

  const selectOption = (option: MenuListOption) => {
    option.onSelect?.();
    if (!option.retainAfterSelect) props.onClose?.();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      props.onClose?.();
    }
  };
  const handleScrollOutside = (e: WheelEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      props.onClose?.();
    }
  };
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') props.onClose?.();
  };

  // メニューにフォーカスがある間のキー操作。アプリ側のショートカットへ流さないよう伝播を止める
  const handleListKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        if (selectableIndices().length === 0) return;
        e.preventDefault();
        e.stopPropagation();
        moveFocus(e.key === 'ArrowDown' ? 1 : -1);
        break;
      }
      case 'Home':
      case 'End': {
        const indices = selectableIndices();
        if (indices.length === 0) return;
        e.preventDefault();
        e.stopPropagation();
        focusItem(e.key === 'Home' ? indices[0] : indices[indices.length - 1]);
        break;
      }
      case 'Enter':
      case ' ': {
        const option = props.options[activeIndex];
        if (!isSelectable(option)) return;
        e.preventDefault();
        e.stopPropagation();
        selectOption(option);
        break;
      }
    }
  };

  const restoreFocus = () => {
    const origin = focusOrigin;
    focusOrigin = undefined;
    if (!origin || !origin.isConnected) return;
    // 選んだ処理が別の要素へフォーカスを移していたら、そちらを優先する
    const active = document.activeElement;
    if (active && active !== document.body && !containerRef?.contains(active)) return;
    origin.focus({ preventScroll: true });
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    if (props.closeByOutsideClick !== false) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('wheel', handleScrollOutside);
    }
    if (props.focusOnMount) {
      const active = document.activeElement;
      focusOrigin = active instanceof HTMLElement ? active : undefined;
      // 項目ではなくリスト自体に当てる。開いた直後は何も選ばれておらず、矢印キーで先頭から辿れる
      containerRef?.focus({ preventScroll: true });
    }
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeydown);
    if (props.closeByOutsideClick !== false) {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('wheel', handleScrollOutside);
    }
    restoreFocus();
  });

  const appearance = props.appearance ?? 'emphasis';
  const menuStyleAdd = appearance === 'simple' ? 'menu-simple' : 'menu-emphasis';

  return (
    <ul
      {...props}
      ref={containerRef}
      class={clsx('menu', menuDirection[dir], menuStyleAdd)}
      role='listbox'
      tabindex={-1}
      style={{
        left: props.align === 'right' ? 'auto' : '0px',
        right: props.align === 'right' ? '0px' : 'auto',
        ...(typeof props.style === 'object' ? props.style : {}),
      }}
      onKeyDown={handleListKeydown}
      onWheel={(e) => {
        e.stopImmediatePropagation();
      }}
    >
      <For each={props.options} fallback={<Nothing>no items</Nothing>}>
        {(option, index) => {
          if (option.type === 'item') {
            return (
              <li
                class='menu-item'
                role='option'
                title={option.title ?? option.label}
                data-menu-index={index()}
                tabindex={option.disabled ? undefined : -1}
                aria-disabled={option.disabled ? 'true' : undefined}
                style={{
                  'pointer-events': option.disabled ? 'none' : 'all',
                  opacity: option.disabled ? 0.5 : 1,
                }}
                onClick={() => selectOption(option)}
              >
                <Show when={option.icon}>
                  <div>
                    <Icon src={option.icon!} base={8} color={option.color ?? color.onBackground} />
                  </div>
                </Show>
                <p
                  class='menu-item-text'
                  style={{
                    'font-family': option.fontFamily,
                    color: option.color ?? color.onBackground,
                  }}
                >
                  {option.label}
                </p>
              </li>
            );
          } else if (option.type === 'label') {
            return (
              <li class='menu-label' role='option' title={option.title ?? option.label}>
                <Show when={option.icon}>
                  <div>
                    <Icon src={option.icon!} base={8} color={option.color ?? color.onBackground} />
                  </div>
                </Show>
                <p
                  class='menu-label-text'
                  style={{
                    'font-family': option.fontFamily,
                    color: option.color ?? color.onBackground,
                  }}
                >
                  {option.label}
                </p>
              </li>
            );
          } else {
            return <li class='menu-divider' />;
          }
        }}
      </For>
    </ul>
  );
};
