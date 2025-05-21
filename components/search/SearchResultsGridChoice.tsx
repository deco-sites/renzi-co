
import { signal } from "@preact/signals";

export const gridColsSignal = signal({
  desktop: 3,
  mobile: 2,
});

interface Props {
  variant: string;
}

const insideSquareStyle =
  "border-1 border-[#56373c] bg-[#56373c] rounded-[2px] w-[4px] h-[4px] float-left block m-0 transition-all duration-500";
const activeSquare = `${insideSquareStyle} bg-white border-white`;
const buttonStyle =
  "relative flex items-center justify-center gap-[3px] float-right border border-[#56373c] rounded-[4px] w-[25px] h-[25px] max-lg:last:mx-3 lg:mr-[0.625rem] lg:last:flex-col";
const activeButton = `${buttonStyle} bg-[#56373c]`;

const SearchResultsGridChoice = ({ variant }: Props) => {
  return (
    <>
      {variant === "mobile"
        ? (
          <div class="column-selector__mobile lg:hidden flex justify-end items-center absolute right-0 top-0">
            <div class="flex">
              <button
                class={gridColsSignal.value.mobile === 1
                  ? activeButton
                  : buttonStyle}
                title="Uma coluna"
                onClick={() =>
                  gridColsSignal.value = { ...gridColsSignal.value, mobile: 1 }}
              >
                <span
                  class={gridColsSignal.value.mobile === 1
                    ? activeSquare
                    : insideSquareStyle}
                />
              </button>

              <button
                class={gridColsSignal.value.mobile === 2
                  ? activeButton
                  : buttonStyle}
                title="Duas colunas"
                onClick={() =>
                  gridColsSignal.value = { ...gridColsSignal.value, mobile: 2 }}
              >
                <span
                  class={gridColsSignal.value.mobile === 2
                    ? activeSquare
                    : insideSquareStyle}
                />
                <span
                  class={gridColsSignal.value.mobile === 2
                    ? activeSquare
                    : insideSquareStyle}
                />
              </button>
            </div>
          </div>
        )
        : (
          <div class="column-selector__desktop flex items-center max-lg:hidden">
            <p class="text-base-300 w-max text-base leading-7 font-bold mr-3 font-quicksand">
              Visualização
            </p>

            <button
              class={gridColsSignal.value.desktop === 2
                ? activeButton
                : buttonStyle}
              title="Duas colunas"
              onClick={() =>
                gridColsSignal.value = { ...gridColsSignal.value, desktop: 2 }}
            >
              <span
                class={gridColsSignal.value.desktop === 2
                  ? activeSquare
                  : insideSquareStyle}
              />
              <span
                class={gridColsSignal.value.desktop === 2
                  ? activeSquare
                  : insideSquareStyle}
              />
            </button>

            <button
              class={gridColsSignal.value.desktop === 3
                ? activeButton
                : buttonStyle}
              title="Três colunas"
              onClick={() =>
                gridColsSignal.value = { ...gridColsSignal.value, desktop: 3 }}
            >
              <div class="flex gap-[2px]">
                <span
                  class={gridColsSignal.value.desktop === 3
                    ? activeSquare
                    : insideSquareStyle}
                />
                <span
                  class={gridColsSignal.value.desktop === 3
                    ? activeSquare
                    : insideSquareStyle}
                />
                <span
                  class={gridColsSignal.value.desktop === 3
                    ? activeSquare
                    : insideSquareStyle}
                />
              </div>
            </button>

            <button
              class={gridColsSignal.value.desktop === 4
                ? activeButton
                : buttonStyle}
              title="Quatro colunas"
              onClick={() =>
                gridColsSignal.value = { ...gridColsSignal.value, desktop: 4 }}
            >
              <span
                class={gridColsSignal.value.desktop === 4
                  ? activeSquare
                  : insideSquareStyle}
              />

              <div class="flex gap-[2px]">
                <span
                  class={gridColsSignal.value.desktop === 4
                    ? activeSquare
                    : insideSquareStyle}
                />
                <span
                  class={gridColsSignal.value.desktop === 4
                    ? activeSquare
                    : insideSquareStyle}
                />
                <span
                  class={gridColsSignal.value.desktop === 4
                    ? activeSquare
                    : insideSquareStyle}
                />
              </div>
            </button>
          </div>
        )}
    </>
  );
};

export default SearchResultsGridChoice;
