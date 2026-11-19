import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../entities/product/model.js';
import { CATEGORIES } from '../entities/category/model.js';
import { BANNERS } from '../entities/banner/model.js';
import { fetchProducts } from '../service/products.js';
import { fetchCategories } from '../service/categories.js';
import { fetchBanners } from '../service/banners.js';
import { fetchFeatures } from '../service/features.js';
import { supabase } from '../service/supabase.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [banners, setBanners] = useState(BANNERS);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories(), fetchBanners(), fetchFeatures()])
      .then(([prods, cats, bans, feats]) => {
        if (prods) setProducts(mergeProducts(PRODUCTS, prods));
        if (cats?.length) setCategories(cats);
        if (bans?.length) setBanners(bans);
        if (feats?.length) setFeatures(feats);
      })
      .catch((err) => console.error('[DataProvider]', err));

    const channel = supabase
      .channel('storefront-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts()
          .then((prods) => {
            if (prods) setProducts(prev => mergeProducts(PRODUCTS, prods));
          })
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'features' }, () => {
        fetchFeatures()
          .then((feats) => { if (feats?.length) setFeatures(feats); })
          .catch((err) => console.error('[DataProvider realtime features]', err));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <DataContext.Provider value={{ products, categories, banners, features }}>
      {children}
    </DataContext.Provider>
  );
}

function mergeProducts(localProducts, remoteProducts) {
  const remoteById = new Map(remoteProducts.map(product => [String(product.id), product]));
  const mergedLocal = localProducts.map(local => {
    const remote = remoteById.get(String(local.id));
    if (!remote) return local;
    remoteById.delete(String(local.id));
    return { ...local, ...remote, image_url: remote.image_url || remote.images?.[0] || local.image_url };
  });
  const vendorProducts = [...remoteById.values()]
    .filter(product => product.active !== false)
    .map(product => ({
      ...product,
      brand: product.brand || product.vendor_name || 'Цветочная студия',
      image_url: product.image_url || product.images?.[0] || null,
    }));
  return [...mergedLocal, ...vendorProducts];
}

export const useData = () => useContext(DataContext);
