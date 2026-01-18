import { Trophy, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
    return (
        <div className="space-y-10">
            <section className="space-y-4 pt-6 pb-8 md:pb-12 md:pt-10 lg:py-32">
                <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                    <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                        StarCraft 2 Tournament Analytics
                    </h1>
                    <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-gray-400">
                        Deep dive into the statistics of the LittleMac StarCraft League (LMSL) and LittleMac Master League (LMML).
                        Analyze win rates, map trends, and player performance.
                    </p>
                    <div className="space-x-4">
                        <Link to="/lmsl" className="inline-flex h-11 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            Explore LMSL
                        </Link>
                        <Link to="/lmml" className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-transparent px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            View LMML Stats
                        </Link>
                    </div>
                </div>
            </section>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                <FeatureCard
                    icon={<Trophy className="h-8 w-8 text-yellow-500" />}
                    title="Tournament History"
                    description="Track champions and brackets across 14 seasons of LMSL and 11 seasons of LMML."
                />
                <FeatureCard
                    icon={<Activity className="h-8 w-8 text-green-500" />}
                    title="Match Analysis"
                    description="Detailed breakdown of matchups, map win rates, and race performance statistics."
                />
                <FeatureCard
                    icon={<Users className="h-8 w-8 text-purple-500" />}
                    title="Player Profiles"
                    description="Comprehensive stats for every participant including historical performance and rivalries."
                />
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 backdrop-blur-sm bg-opacity-50 hover:bg-opacity-80 transition-all border-gray-800 bg-gray-900/40">
            <div className="mb-4">{icon}</div>
            <h3 className="font-semibold text-xl mb-2 text-gray-100">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    );
}
