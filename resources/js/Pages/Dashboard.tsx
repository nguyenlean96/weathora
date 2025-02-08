import DebugPanel from '@/Components/debug-panel';
import Main from '@/Components/main';
import SearchPanel from '@/Components/search-panel';
import Guest from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { useViewportSize } from '@mantine/hooks';

export default function Dashboard() {
    const { width, height } = useViewportSize();
    return (
        <Guest>
            <Head title="Dashboard" />

            <div className="relative w-screen h-screen overflow-hidden">
                <div className="flex flex-col relative md:grid md:grid-cols-5 lg:grid-cols-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 right-0 z-50 md:relative md:z-0 md:col-span-2 lg:col-span-1 md:h-full">
                        <SearchPanel
                            width={width}
                            height={height}
                        />
                    </div>
                    <div className="md:col-span-3 md:overflow-hidden">
                        <Main
                            width={width}
                            height={height}
                        />
                    </div>
                </div>
                <DebugPanel
                    width={width}
                    height={height}
                />
            </div>
        </Guest>
    );
}
