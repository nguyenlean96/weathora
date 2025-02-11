import { useState, useEffect, useMemo } from 'react';
/**
 *
 * This module is named: useGeography
 * Yet, the only geographical unit is used is the city
 */

export function useGeography(base_url: string) {
    const [loading, setLoading] = useState<boolean>(false);
    const [isReset, setIsReset] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [citiesData, setCitiesData] = useState<Set<string>>(new Set());
    const [data, setData] = useState<Array<City>>([]);

    const fetchData = async () => {
        if (loading) {
            return;
        }

        if (currentPage > totalPages) {
            return;
        }
        setLoading(true);

        try {
            if (totalPages === 1 && currentPage === totalPages) {
                const res = await fetch(base_url);
                const data = await res.json();

                setCurrentPage((_: number) => data.data.current_page);
                setTotalPages((_: number) => data.data.last_page);

                // Add new cities to the set
                setCitiesData(
                    prev => {
                        data.data.data.map((c: City) => {
                            if (
                                c.name && c.country
                                && c.name.length > 0
                                && c.country.length > 0
                            ) {
                                prev.add(`${c.name}|${c.country}`);
                            }
                        });

                        return prev;
                    }
                );

                setData(data.data.data);

            } else {
                const res = await fetch(base_url + `&page=${currentPage}`);
                const data = await res.json();

                setCurrentPage((_: number) => data.data.current_page);
                setTotalPages((_: number) => data.data.last_page);

                // Add new cities to the set
                let newCitites = data.data.data.reduce((acc: Array<City>, c: City, _i: number) => {
                    if (
                        !citiesData.has(`${c.name}|${c.country}`)
                        && c.name && c.country
                        && c.name.length > 0
                        && c.country.length > 0
                    ) {
                        setCitiesData(prev => prev.add(`${c.name}|${c.country}`));
                        acc.push(c);
                    }

                    return acc;
                }, [data]);

                setData(prev => [...prev, ...newCitites]);
            }
        }
        catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const loadMoreCities = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    }


    useEffect(() => {
        if (isReset) {

            if (loading) {
                return;
            }
            const proceedReset = new Promise((resolve: (value?: any) => void) => {
                setCurrentPage(1);
                setTotalPages(1);
                setCitiesData(_ => new Set());
                setData(_ => []);
                resolve();
            });
            proceedReset
                .then(() => {
                    const delay = setTimeout(() => {
                        fetchData();
                        clearTimeout(delay);
                    }, 1000);
                })
                .finally(() => {
                    setIsReset(false);
                });
        }
    }, [isReset, loading])

    useEffect(() => {
        if (!isReset) {
            setIsReset(true);
        }
    }, [base_url])

    useEffect(() => {
        fetchData();
    }, [currentPage])

    useEffect(() => {
        fetchData();
    }, [])

    const reset = () => {
        setIsReset(true);
    }

    return {
        currentPage,
        totalPages,
        isLoading: loading,
        data,
        loadMoreCities,
        fetchData,
        pendingReset: isReset,
        reset,
    };
}
