import { useState, useEffect } from "preact/hooks";
import type { Filter, FilterRange } from "apps/commerce/types.ts";
import { Product } from "apps/commerce/types.ts";
import { invoke } from "$store/runtime.ts";

export interface Props {
  filters: Filter[];
}

const formatPriceRange = (min: number | "", max: number | ""): string => {
  if (!min && !max) return "";
  const minText = `R$ ${min}`;
  const maxText = `R$ ${max}`;

  if (min && max) {
    return `Preço: ${minText} - ${maxText}`;
  }
  if (min) {
    return `Preço: A partir de ${minText}`;
  }
  if (max) {
    return `Preço: Até ${maxText}`;
  }
  return "";
};

function FilterPrice({ filters = [] }: Props) {
  const priceFilter = filters.find(
    (filter): filter is FilterRange => filter.key === "filter.v.price"
  );

  const minPossiblePrice = Math.floor(priceFilter?.values?.min ?? 0);

  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>(""); // 1. Estado para a mensagem de erro

  const allPrices = products.map((product) => product?.offers?.lowPrice ?? 0);
  const maxPossiblePrice = Math.ceil(Math.max(...allPrices, 0)); // Garante que não seja -Infinity

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gte = params.get("filter.v.price.gte");
    const lte = params.get("filter.v.price.lte");
    setMinPrice(gte ? Number(gte) : "");
    setMaxPrice(lte ? Number(lte) : "");

    const getProducts = async (query: string) => {
      const results = await invoke.shopify.loaders.ProductList({
        props: { query, count: 25, sort: "price-descending" }, // Aumentar a contagem para obter um maxPrice mais preciso
      });
      setProducts(results || []);
    };

    if (globalThis.location) getProducts(globalThis.location.pathname);
  }, []);

  // 2. Função para validar os inputs de preço
  const handlePriceChange = (value: string, type: "min" | "max") => {
    if (value.includes(",")) {
      const baseValue = Math.floor(Number(value.replace(",", ".")));
      setErrorMessage(
        `Insira um valor válido. Os dois valores válidos mais próximos são ${baseValue} e ${baseValue + 1}.`
      );
      return;
    }

    setErrorMessage("");
    const numericValue = value ? Number(value) : "";

    if (type === "max" && numericValue && numericValue > maxPossiblePrice) {
      setErrorMessage(`O valor máximo permitido é R$ ${maxPossiblePrice}.`);
    }

    if (type === "min") {
      setMinPrice(numericValue);
    } else {
      setMaxPrice(numericValue);
    }
  };

  const applyFilter = () => {
    const params = new URLSearchParams(window.location.search);
    if (minPrice) params.set("filter.v.price.gte", String(minPrice));
    else params.delete("filter.v.price.gte");

    if (maxPrice) params.set("filter.v.price.lte", String(maxPrice));
    else params.delete("filter.v.price.lte");

    window.location.search = params.toString();
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setErrorMessage(""); // Limpa o erro
    const params = new URLSearchParams(window.location.search);
    params.delete("filter.v.price.gte");
    params.delete("filter.v.price.lte");
    window.location.search = params.toString();
  };

  const isFilterApplied = minPrice || maxPrice;

  if (!priceFilter) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <h3 className="font-normal">{priceFilter.label}</h3>

      {isFilterApplied && (
        <div className="flex items-center justify-between">
          <div className="border rounded-full px-3 py-1 text-sm">
            <span>{formatPriceRange(minPrice, maxPrice)}</span>
          </div>
          <button
            onClick={handleReset}
            className="underline text-sm font-semibold"
          >
            Limpar
          </button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <span className="text-gray-500 mr-2">R$</span>
            <input
              type="number"
              name="minPrice"
              min="0"
              value={minPrice}
              placeholder={String(minPossiblePrice)}
              onChange={(e) => handlePriceChange(e.currentTarget.value, "min")} // 3. Integrar validação
              className="input input-ghost w-full !px-0 !h-10 focus:!outline-none"
            />
          </div>
          <label htmlFor="minPrice" className="text-xs text-gray-500">De</label>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <span className="text-gray-500 mr-2">R$</span>
            <input
              type="number"
              name="maxPrice"
              value={maxPrice}
              max={maxPossiblePrice}
              placeholder={String(maxPossiblePrice)}
              onChange={(e) => handlePriceChange(e.currentTarget.value, "max")} // 3. Integrar validação
              className="input input-ghost w-full !px-0 !h-10 focus:!outline-none"
            />
          </div>
          <label htmlFor="maxPrice" className="text-xs text-gray-500">Para</label>
        </div>
      </div>
      
      {/* 4. Exibir a mensagem de erro */}
      {errorMessage && (
        <div class="text-yellow-700 text-sm p-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.031-1.742 3.031H4.42c-1.532 0-2.492-1.697-1.742-3.031l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{errorMessage}</span>
        </div>
      )}

      <button
        onClick={applyFilter}
        disabled={!!errorMessage} // Desabilita o botão se houver erro
        className="btn bg-primary hover:bg-gray-800 text-white w-full uppercase rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Filtrar
      </button>
    </div>
  );
}

export default FilterPrice;