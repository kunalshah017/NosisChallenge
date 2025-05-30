import { Pressable, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '~/lib/cn';
import { usePathname, router } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuthStore } from '~/store/useAuthStore';

import LogoIcon from '~/assets/svg/logo-icon.svg';
import ProfileIcon from '~/assets/svg/profile-icon.svg';
import SearchIcon from '~/assets/svg/search-icon.svg';

type TabName = 'Home' | 'Explore' | 'Library' | 'Nosis' | 'Preferences';

interface HeaderProps {
    currentTab?: TabName;
}

export default function Header({ currentTab: propCurrentTab }: HeaderProps) {
    const pathname = usePathname();
    const { colors, isDarkColorScheme } = useColorScheme();
    const { isSignedIn, signIn } = useAuthStore();

    const getTabFromPathname = (path: string): TabName => {
        if (path === '/') return 'Home';
        if (path.includes('explore')) return 'Explore';
        if (path.includes('library')) return 'Library';
        if (path.includes('preferences')) return 'Preferences';
        return 'Nosis';
    };

    const currentTab = propCurrentTab || getTabFromPathname(pathname);

    return (
        <SafeAreaView
            edges={['top']}
            style={{
                backgroundColor: colors.background,
                shadowColor: isDarkColorScheme ? '#000' : '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: isDarkColorScheme ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 4, // Android shadow
                zIndex: 1000,
            }}
            className="bg-background"
        >
            <View
                className="flex-row items-center justify-between px-4 py-3">
                <View className="flex-row items-center">
                    <LogoIcon
                        width={32}
                        height={32}
                        color={colors.primary}
                    />
                    <Text className="text-foreground text-xl font-dmsans-bold ml-2">
                        {currentTab}
                    </Text>
                </View>
                {pathname !== '/preferences' && (
                    <View className="flex-1 justify-end items-center flex-row gap-2 max-w-[68%]">
                        <View className="flex-1 relative">
                            <View className="absolute left-3 top-1/2 -translate-y-[60%] z-10">
                                <SearchIcon
                                    width={18}
                                    height={18}
                                    color={colors.grey}
                                />
                            </View>
                            <TextInput
                                placeholder={`Search for books`}
                                placeholderTextColor={colors.grey}
                                onChangeText={(text) => {
                                    console.log('Search input changed:', text);
                                }}
                                className="bg-card rounded-lg pl-10 pr-3 py-2 text-foreground font-dmsans-regular"
                                style={{
                                    backgroundColor: colors.card,
                                    color: colors.foreground,
                                    fontFamily: 'DMSans-Regular',
                                }}
                            />
                        </View>

                        {
                            isSignedIn ? (
                                <Pressable
                                    onPress={() => {
                                        router.push('/preferences');
                                    }}
                                >
                                    {({ pressed }) => (
                                        <View className={cn(pressed && 'opacity-90') + ' bg-primary rounded-full p-2'}>
                                            <ProfileIcon
                                                width={24}
                                                height={24}
                                            />
                                        </View>
                                    )}
                                </Pressable>)
                                : (
                                    <TouchableOpacity
                                        className="h-10 flex px-4 py-2 bg-primary rounded-[14px] justify-center items-center"
                                        onPress={signIn}
                                    >
                                        <Text className="text-white font-dmsans-medium h-full w-full ">Sign In</Text>
                                    </TouchableOpacity>
                                )
                        }
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}