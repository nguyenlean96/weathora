import { useState } from "react";

export function useUnsplashImage() {
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async (keyword: string): Promise<any> => {
        setLoading(true);
        try {
            const res = await fetch(
                route('api.v1.unsplash.photos', { search: keyword })
            );
            return await res.json();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchData,
    };
};
