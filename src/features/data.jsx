import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../entities/product/model.js';
import { CATEGORIES } from '../entities/category/model.js';
import { BANNERS } from '../entities/banner/model.js';
import { fetchProducts } from '../service/products.js';
import { fetchCategories } from '../service/categories.js';
import { fetchBanners } from '../service/banners.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [banners, setBanners] = useState(BANNERS);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories(), fetchBanners()])
      .then(([prods, cats, bans]) => {
        if (prods?.length) setProducts(prods);
        if (cats?.length) setCategories(cats);
        if (bans?.length) setBanners(bans);
      })
      .catch((err) => console.error('[DataProvider]', err));
  }, []);

  return (
    <DataContext.Provider value={{ products, categories, banners }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
