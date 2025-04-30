import { forwardRef } from "preact/compat";
import { AvailableIcons, PaymentIcons, SocialIcons } from "./Icon.tsx";
import type { ComponentType, JSX } from "preact";

export type Props =
  & Omit<JSX.IntrinsicElements["button"], "loading">
  & {
    loading?: boolean;
    iconId?: AvailableIcons | SocialIcons | PaymentIcons;
    as?: keyof JSX.IntrinsicElements | ComponentType;
    disabled?: boolean;
    type?: string;
  };


const Button = forwardRef<HTMLButtonElement, Props>(({
//   as = "button",
  type = "button",
  class: _class = "",
  loading,
  disabled,
  children,
//   iconId,
  ...props
}, ref) => (
    <button
      {...props}
      className={`rounded-full border-2 border-solid no-animation ${_class}`}
      disabled={disabled || loading}
      type={type}
      ref={ref}
    >
      {loading ? <span class="loading loading-spinner" /> : children}
    </button>
  ));

// }, ref) => (
//   <button
//     {...props}
//     className={`rounded-full border-2 border-solid no-animation ${_class}`}
//     disabled={disabled || loading}
//     type={type}
//     ref={ref}
//   >
//     {loading ? <span class="loading loading-spinner" /> : children}
//   </button>
// ));

export default Button;