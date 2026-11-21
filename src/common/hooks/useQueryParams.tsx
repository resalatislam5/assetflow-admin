import { useMemo } from 'react';
import { useSearchParams, type URLSearchParamsInit } from 'react-router';
import { useAppSelector } from '../../app/hooks/hooks';
import { cleanQuery } from '../utils/cleanQuery';

type QueryParams = object;

export const useQueryParams = <T extends QueryParams = Record<string, unknown>>(
  pagination: boolean = true,
  defaultValue?: T,
) => {
  const [searchParams, setSearchParams] = useSearchParams(defaultValue as URLSearchParamsInit);
  const filterValue = useAppSelector((store) => store.filter);

  const setQuery = (newParams: Partial<T>) => {
    setSearchParams((prev) => {
      const prevObj: Record<string, string> = {};
      prev.forEach((value, key) => {
        prevObj[key] = value;
      });

      const updated = cleanQuery({
        ...prevObj,
        ...(newParams as Record<string, unknown>),
      });

      return updated;
    });
  };

  /* ---------------- GET QUERY DATA ---------------- */
  const queryObject = useMemo(() => {
    const parsedObj: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      parsedObj[key] = value;
    });

    if (pagination) {
      return {
        ...filterValue,
        ...parsedObj,
      } as unknown as T;
    } else {
      return parsedObj as unknown as T;
    }
  }, [searchParams, filterValue, pagination]);

  return {
    query: queryObject,
    setQuery,
  };
};
