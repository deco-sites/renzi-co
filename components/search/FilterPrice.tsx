import { useState, useEffect } from "preact/hooks";
import type { Filter, FilterRange } from "apps/commerce/types.ts";
import { Product } from "apps/commerce/types.ts";

import { invoke } from "$store/runtime.ts";

export interface Props {
  filters: Filter[];
}

// Função auxiliar para formatar a exibição do preço selecionado
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
  // Se max existir (o type guard garante que é um número se não for string vazia)
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
  // const maxPossiblePrice = Math.ceil(priceFilter?.values?.max ?? 0);

  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [products, setProducts] = useState<Product[]>([]);

  // const maxPossiblePrice = Math.ceil(products?.find(() => ) ?? 0);

  const allPrices = products.map(product => product?.offers?.lowPrice ?? 0);
  const maxPossiblePrice = Math.ceil(Math.max(...allPrices));

  console.log(allPrices);
  



  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gte = params.get("filter.v.price.gte");
    const lte = params.get("filter.v.price.lte");
    setMinPrice(gte ? Number(gte) : "");
    setMaxPrice(lte ? Number(lte) : "");

    // const query = "aneis/aneis-de-coracao";

    const getProducts = async (query:string) => {
      const results = await invoke.shopify.loaders.ProductList({
        props: { query, count: 25 },
      });

      setProducts(results || []);

      console.log(results);
      
    };

    if(globalThis.location) getProducts(globalThis.location.pathname);
  }, []);

  const applyFilter = () => {
    const params = new URLSearchParams(window.location.search);
    if (minPrice) params.set("filter.v.price.gte", String(minPrice));
    else params.delete("filter.v.price.gte");

    if (maxPrice) params.set("filter.v.price.lte", String(maxPrice));
    else params.delete("filter.v.price.lte");

    window.location.search = params.toString();
  };

  // Nova função para limpar o filtro de preço
  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
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

      {/* Seção que mostra o filtro aplicado e o botão de Reset */}
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

      {/* Seção dos inputs de preço */}
      <div className="flex items-center gap-4">
        {/* Input "From" */}
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <span className="text-gray-500 mr-2">R$</span>
            <input
              type="number"
              name="minPrice"
              min="0"
              value={minPrice}
              placeholder={String(minPossiblePrice)}
              onChange={(e) => {
                setMinPrice(
                  e?.currentTarget?.value ? Number(e?.currentTarget?.value) : ""
                );
              }}
              className="input input-ghost w-full !px-0 !h-10 focus:!outline-none"
            />
          </div>
          <label htmlFor="minPrice" className="text-xs text-gray-500">
            De
          </label>
        </div>

        {/* Input "To" */}
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <span className="text-gray-500 mr-2">R$</span>
            <input
              type="number"
              name="maxPrice"
              value={maxPrice}
              max={maxPossiblePrice}
              placeholder={String(maxPossiblePrice)}
              onChange={(e) => {
                setMaxPrice(
                  e?.currentTarget?.value ? Number(e?.currentTarget?.value) : ""
                );
              }}
              className="input input-ghost w-full !px-0 !h-10 focus:!outline-none"
            />
          </div>
          <label htmlFor="maxPrice" className="text-xs text-gray-500">
            Para
          </label>
        </div>
      </div>

      {/* Botão de Filtrar */}
      <button
        onClick={applyFilter}
        className="btn bg-primary hover:bg-gray-800 text-white w-full uppercase rounded-md"
      >
        Filtrar
      </button>
    </div>
  );
}

export default FilterPrice;
