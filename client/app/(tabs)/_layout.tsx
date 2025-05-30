import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Platform } from 'react-native';

import { useColorScheme } from '~/lib/useColorScheme';

import HomeIcon from '~/assets/svg/home-icon.svg';
import ExploreIcon from '~/assets/svg/explore-icon.svg';
import LibraryIcon from '~/assets/svg/library-icon.svg';

export default function TabsLayout() {
    const { colors, isDarkColorScheme } = useColorScheme();

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
        <View className="flex-1 bg-background">
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: colors.tabBarActiveTint,
                    tabBarInactiveTintColor: colors.tabBarInactiveTint,
                    tabBarStyle: {
                        backgroundColor: colors.grey6,
                        shadowColor: isDarkColorScheme ? '#000' : '#000',
                        shadowOffset: {
                            width: 0,
                            height: -2,
                        },
                        shadowOpacity: isDarkColorScheme ? 0.3 : 0.1,
                        shadowRadius: 8,
                        elevation: 8, // Android shadow
                        height: 75,
                        paddingTop: 5,
                        paddingBottom: 5,
                        borderTopWidth: 0,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
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
            <SafeAreaView
                edges={['bottom']}
                style={{
                    backgroundColor: colors.grey6,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 999,
                }}
            />
        </View>
    );
}