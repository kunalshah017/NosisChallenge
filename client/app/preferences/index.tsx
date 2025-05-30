import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { useThemePreferences, useLanguagePreferences, useReadingPreferences, type Language, type ThemeMode } from '~/store/usePreferencesStore';
import { useAuthStore } from '~/store/useAuthStore';

import { Toggle } from '~/components/Toggle';
import Dropdown from '~/components/Dropdown';

import ProfileIcon from '~/assets/svg/profile-icon.svg';

const PreferencesScreen = () => {
    const { colors } = useColorScheme();
    const { themeMode, setThemeMode } = useThemePreferences();
    const { language, setLanguage } = useLanguagePreferences();
    const { signOut } = useAuthStore();
    const { autoBookmark, readingReminders, setAutoBookmark, setReadingReminders } = useReadingPreferences();

    const themeOptions = [
        {
            label: 'Light',
            value: 'light',
            icon: 'sunny-outline'
        },
        {
            label: 'Dark',
            value: 'dark',
            icon: 'moon-outline'
        },
        {
            label: 'System',
            value: 'system',
            icon: 'phone-portrait-outline'
        },
    ];

    const languageOptions = [
        { label: 'English', value: 'en', emoji: '🇺🇸' },
        { label: 'Español', value: 'es', emoji: '🇪🇸' },
        { label: 'Français', value: 'fr', emoji: '🇫🇷' },
        { label: 'Deutsch', value: 'de', emoji: '🇩🇪' },
    ];

    const handleGoBack = () => {
        router.back();
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    }

    return (
        <View className="flex-1 bg-background">
            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
            >
                <View className="h-14 flex-row items-center">
                    <TouchableOpacity className="flex-row items-center" onPress={handleGoBack}>
                        <Ionicons name="chevron-back" size={20} color="#737373" />
                        <Text className="text-[#737373] ml-1 font-dmsans-regular">Back</Text>
                    </TouchableOpacity>
                </View>
                {/* User Profile Section */}
                <View className="rounded-xl p-4 mb-4">
                    <View className="flex-row items-center">
                        <View className="flex-1 ml-4">
                            <Text className="text-foreground text-lg font-dmsans-bold">
                                John Doe
                            </Text>
                            <Text className="text-stone-500 dark:text-stone-400 text-sm font-dmsans-regular">
                                john.doe@example.com
                            </Text>
                            <View className="flex-row items-center mt-1">
                                <Text className="text-stone-500 dark:text-stone-400 text-xs font-dmsans-regular">
                                    📚 12 books read • 🔥 7 day streak
                                </Text>
                            </View>
                        </View>

                        <View className="relative">
                            <View className="h-16 w-16 bg-primary flex justify-center items-center rounded-full">
                                <ProfileIcon
                                    width={30}
                                    height={30}
                                />
                            </View>
                            <TouchableOpacity className="absolute -bottom-1 -right-1 rounded-full p-1 bg-white dark:bg-gray-800 border-primary border-2 dark:border-gray-700">
                                <Ionicons name="pencil-outline" size={16} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Appearance Section */}
                <View className="bg-card rounded-xl p-4 mb-4 border border-stone-200 dark:border-gray-700">
                    <Text className="text-foreground text-lg font-dmsans-bold mb-4">
                        Appearance
                    </Text>

                    {/* Theme Setting */}
                    <Dropdown
                        title="Theme"
                        options={themeOptions}
                        selectedValue={themeMode}
                        onSelect={(value) => setThemeMode(value as ThemeMode)}
                    />
                </View>

                {/* Language & Region Section */}
                <View className="bg-card rounded-xl p-4 mb-4 border border-stone-200 dark:border-gray-700">
                    <Text className="text-foreground text-lg font-dmsans-bold mb-4">
                        Language & Region
                    </Text>

                    {/* Language Selection */}
                    <Dropdown
                        title="Language"
                        options={languageOptions}
                        selectedValue={language}
                        onSelect={(value) => setLanguage(value as Language)}
                    />
                </View>

                {/* Reading Preferences Section */}
                <View className="bg-card rounded-xl p-4 mb-4 border border-stone-200 dark:border-gray-700">
                    <Text className="text-foreground text-lg font-dmsans-bold mb-4">
                        Reading
                    </Text>

                    {/* Auto Bookmark */}
                    <View className="flex-row items-center justify-between py-3 border-b border-stone-100 dark:border-gray-600">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 bg-stone-100 dark:bg-gray-700 rounded-lg items-center justify-center mr-3">
                                <Ionicons name="bookmark-outline" size={20} color={colors.foreground} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-foreground font-dmsans-medium">
                                    Auto Bookmark
                                </Text>
                                <Text className="text-stone-500 dark:text-stone-400 text-sm font-dmsans-regular">
                                    Automatically save reading progress
                                </Text>
                            </View>
                        </View>
                        <Toggle
                            value={autoBookmark}
                            onValueChange={setAutoBookmark}
                        />
                    </View>

                    {/* Reading Reminders */}
                    <View className="flex-row items-center justify-between py-3">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 bg-stone-100 dark:bg-gray-700 rounded-lg items-center justify-center mr-3">
                                <Ionicons name="notifications-outline" size={20} color={colors.foreground} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-foreground font-dmsans-medium">
                                    Reading Reminders
                                </Text>
                                <Text className="text-stone-500 dark:text-stone-400 text-sm font-dmsans-regular">
                                    Get notified to maintain your streak
                                </Text>
                            </View>
                        </View>
                        <Toggle
                            value={readingReminders}
                            onValueChange={setReadingReminders}
                        />
                    </View>
                </View>

                {/* About Section */}
                <View className="bg-card rounded-xl mb-4 p-4 border border-stone-200 dark:border-gray-700">
                    <Text className="text-foreground text-lg font-dmsans-bold mb-4">
                        About
                    </Text>

                    <TouchableOpacity className="flex-row items-center justify-between py-3">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 bg-stone-100 dark:bg-gray-700 rounded-lg items-center justify-center mr-3">
                                <Ionicons name="information-circle-outline" size={20} color={colors.foreground} />
                            </View>
                            <Text className="text-foreground font-dmsans-medium">
                                App Version
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-stone-500 dark:text-stone-400 font-dmsans-medium mr-2">
                                v1.0.0
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color={colors.foreground} />
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleSignOut}
                    className="flex-row items-center justify-between bg-card rounded-xl p-5 border border-stone-200 dark:border-gray-700 ">
                    <View className="flex-row items-center flex-1">
                        <Text className="text-destructive text-lg font-dmsans-bold">
                            Sign Out
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="chevron-forward" size={16} color={colors.destructive} />
                    </View>
                </TouchableOpacity>

                {/* Footer */}
                <View className="flex justify-start gap-5 px-4 py-5 mt-8">
                    <Text className="text-5xl text-stone-400 font-poppins-bold h-[3.5rem]">next gen.,</Text>
                    <Text className="text-5xl text-stone-400 mb-1 font-poppins-bold h-[3.5rem]">library.</Text>
                    <Text className="text-sm text-stone-400 font-poppins-regular">the world&apos;s largest digital library</Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default PreferencesScreen;