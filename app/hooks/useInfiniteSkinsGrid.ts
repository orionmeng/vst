/**
 * Infinite Scrolling Skins Grid Hook
 * 
 * Manages infinite scroll pagination for skins lists.
 * Handles filter changes, intersection observer, and loading states.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ITEMS_PER_PAGE, Skin } from "@/lib/constants";

interface UseInfiniteSkinsGridOptions {
  apiEndpoint: string;
}

/**
 * Custom hook for infinite scroll skins loading
 * Resets pagination when filters change
 * Uses Intersection Observer for scroll detection
 */
export function useInfiniteSkinsGrid({ apiEndpoint }: UseInfiniteSkinsGridOptions) {
  const searchParams = useSearchParams();
  const weapon = searchParams.get("weapon");
  const search = searchParams.get("search");

  const [skins, setSkins] = useState<Skin[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const prevFiltersRef = useRef({ weapon, search });
  const isInitialMount = useRef(true);

  // Load skins
  useEffect(() => {
    const filtersChanged = 
      prevFiltersRef.current.weapon !== weapon || 
      prevFiltersRef.current.search !== search;

    // If filters changed or initial mount, reset and fetch page 1
    if (filtersChanged || isInitialMount.current) {
      isInitialMount.current = false;
      prevFiltersRef.current = { weapon, search };
      
      const params = new URLSearchParams();
      if (weapon) params.set("weapon", weapon);
      if (search) params.set("search", search);
      params.set("page", "1");
      params.set("limit", ITEMS_PER_PAGE.toString());

      fetch(`${apiEndpoint}?${params.toString()}`)
        .then((res) => res.json())
        .then((data: Skin[]) => {
          setSkins(data);
          setHasMore(data.length >= ITEMS_PER_PAGE);
          setPage(1);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load skins", err);
          setIsLoading(false);
        });
      
      // Set loading state immediately, but in a microtask
      Promise.resolve().then(() => {
        setSkins([]);
        setIsLoading(true);
      });
      return;
    }

    // Normal pagination fetch
    if (!hasMore || isLoading || page === 1) return;

    const params = new URLSearchParams();
    if (weapon) params.set("weapon", weapon);
    if (search) params.set("search", search);
    params.set("page", page.toString());
    params.set("limit", ITEMS_PER_PAGE.toString());

    Promise.resolve().then(() => setIsLoading(true));

    fetch(`${apiEndpoint}?${params.toString()}`)
      .then((res) => res.json())
      .then((data: Skin[]) => {
        setHasMore(data.length >= ITEMS_PER_PAGE);
        setSkins((prev) => [...prev, ...data]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load skins", err);
        setIsLoading(false);
      });
  }, [page, weapon, search, apiEndpoint]);

  // Intersection observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isLoading]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  return {
    skins,
    isLoading,
    observerTarget,
  };
}
