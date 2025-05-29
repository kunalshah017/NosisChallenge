import { Pressable, View, TextInput } from 'react-native';
import { cn } from '~/lib/cn';
import { usePathname } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';

import { Text } from '~/components/nativewindui/Text';

import LogoIcon from '~/assets/svg/logo-icon.svg';
import ProfileIcon from '~/assets/svg/profile-icon.svg';
import SearchIcon from '~/assets/svg/search-icon.svg';

type TabName = 'Home' | 'Explore' | 'Library' | 'Nosis';

interface HeaderProps {
    currentTab?: TabName;
}

export default function Header({ currentTab: propCurrentTab }: HeaderProps) {
    const { colors } = useColorScheme();
    const pathname = usePathname();

    // Determine current tab based on pathname
    const getCurrentTab = (): TabName => {
        if (pathname.startsWith('/explore')) return 'Explore';
        if (pathname.startsWith('/library') || pathname.startsWith('/details')) return 'Library';
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

                <Text variant="title2" className="font-poppins-bold color-primary">
                    {currentTab}
                </Text>
            </View>

            <View className="flex-1 justify-end items-center flex-row gap-2 max-w-[70%] ">
                <View className="w-[80%] relative">
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

                <Pressable
                    onPress={() => {
                        console.log('Profile pressed');
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
                </Pressable>
            </View>
        </View>
    );
}