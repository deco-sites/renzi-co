
import { useId as usePreactId } from "preact/hooks";

export const useId = () => `${usePreactId()}${Math.trunc(Math.random() * 1e6)}`;