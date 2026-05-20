import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../entities/product/model.js';
import { CATEGORIES } from '../entities/category/model.js';
import { BANNERS } from '../entities/banner/model.js';
import { fetchProducts } from '../service/products.js';
import { fetchCategories } from '../service/categories.js';
import { fetchBanners } from '../service/banners.js';
import { supabase } from '../service/supabase.js';

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

    const channel = supabase
      .channel('storefront-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts()
          .then((prods) => { if (prods?.length) setProducts(prods); })
          .catch((err) => console.error('[DataProvider realtime products]', err));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        fetchCategories()
          .then((cats) => { if (cats?.length) setCategories(cats); })
          .catch((err) => console.error('[DataProvider realtime categories]', err));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, () => {
        fetchBanners()
          .then((bans) => { if (bans?.length) setBanners(bans); })
          .catch((err) => console.error('[DataProvider realtime banners]', err));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <DataContext.Provider value={{ products, categories, banners }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
