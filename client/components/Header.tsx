import { Pressable, View, Text, TextInput, TouchableOpacity } from 'react-native';
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
    const { colors } = useColorScheme();
    const pathname = usePathname();
    const { isSignedIn, signIn } = useAuthStore();

    // Determine current tab based on pathname
    const getCurrentTab = (): TabName => {
        if (pathname.startsWith('/explore')) return 'Explore';
        if (pathname.startsWith('/library') || pathname.startsWith('/details')) return 'Library';
        if (pathname.startsWith('/read')) return 'Nosis';
        if (pathname.startsWith('/preferences')) return 'Preferences';
        if (pathname.startsWith('/')) return 'Home';
        return 'Nosis';
    };

    // Use prop if provided, otherwise determine from route
    const currentTab = propCurrentTab || getCurrentTab();

    return (
        <View className="w-full flex flex-row items-center justify-between my-3">
            <View className='flex flex-row items-center gap-2'>
                <LogoIcon
                    width={32}
                    height={32}
                />

                <Text className="font-poppins-bold color-primary text-xl">
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
    );
}