import '~/global.css';

import { Tabs } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';

import HomeIcon from '~/assets/svg/home-icon.svg';
import ExploreIcon from '~/assets/svg/explore-icon.svg';
import LibraryIcon from '~/assets/svg/library-icon.svg';

export {
    ErrorBoundary,
} from 'expo-router';

export default function TabsLayout() {
    const { colors } = useColorScheme();



    const options = {
        HOME: {
            title: 'Home',
            tabBarIcon: ({ focused }: { focused: boolean }) => <HomeIcon width={24} height={24} opacity={focused ? 1 : 0.7} />,
            tabBarLabel: 'Home',
        },
        EXPLORE: {
            title: 'Explore',
            tabBarIcon: ({ focused }: { focused: boolean }) => <ExploreIcon width={24} height={24} opacity={focused ? 1 : 0.7} />,
            tabBarLabel: 'Explore',
        },
        LIBRARY: {
            title: 'Library',
            tabBarIcon: ({ focused }: { focused: boolean }) => <LibraryIcon width={24} height={24} opacity={focused ? 1 : 0.7} />,
            tabBarLabel: 'Library',
        },
    } as const;

    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: colors.tabBarActiveTint,
                    tabBarInactiveTintColor: colors.tabBarInactiveTint,
                    tabBarStyle: {
                        backgroundColor: colors.grey6,
                        shadowColor: 'transparent',
                        height: 85,
                        paddingTop: 8,
                        paddingBottom: 8,
                    },
                    tabBarLabelStyle: {
                        fontFamily: 'DMSans-SemiBold',
                        fontSize: 12,
                    },
                    tabBarItemStyle: { paddingVertical: 5, paddingHorizontal: 10 },
                }}
            >
                <Tabs.Screen name="index" options={options.HOME} />
                <Tabs.Screen name="explore/index" options={options.EXPLORE} />
                <Tabs.Screen name="library/index" options={options.LIBRARY} />
            </Tabs>
        </>
    );
}