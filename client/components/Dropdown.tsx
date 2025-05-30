import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';

interface DropdownOption {
    label: string;
    value: string;
    icon?: string;
    emoji?: string;
}

interface DropdownProps {
    options: DropdownOption[];
    selectedValue: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    title: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    selectedValue,
    onSelect,
    placeholder = 'Select an option',
    title,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const { colors } = useColorScheme();

    const selectedOption = options.find(option => option.value === selectedValue);

    const handleSelect = (value: string) => {
        onSelect(value);
        setIsVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                className="flex-row items-center justify-between py-3"
                onPress={() => setIsVisible(true)}
            >
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-stone-100 dark:bg-gray-700 rounded-lg items-center justify-center mr-3">
                        {selectedOption?.emoji ? (
                            <Text className="text-lg">{selectedOption.emoji}</Text>
                        ) : (
                            <Ionicons
                                name={(selectedOption?.icon || 'list-outline') as any}
                                size={20}
                                color={colors.foreground}
                            />
                        )}
                    </View>
                    <View className="flex-1">
                        <Text className="text-foreground font-dmsans-medium">
                            {title}
                        </Text>
                        <Text className="text-stone-500 dark:text-stone-400 text-sm font-dmsans-regular">
                            {selectedOption?.label || placeholder}
                        </Text>
                    </View>
                </View>
                <Ionicons name="chevron-down" size={16} color={colors.foreground} />
            </TouchableOpacity>

            <Modal
                visible={isVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsVisible(false)}
            >
                <Pressable
                    className="flex-1 bg-black/50 justify-center items-center px-4"
                    onPress={() => setIsVisible(false)}
                >
                    <Pressable
                        className="bg-card rounded-xl p-4 w-full max-w-sm border border-stone-200 dark:border-gray-700"
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-foreground text-lg font-dmsans-bold">
                                Select {title}
                            </Text>
                            <TouchableOpacity onPress={() => setIsVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="max-h-60" showsVerticalScrollIndicator={true}>
                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={option.value}
                                    className={`flex-row items-center py-3 px-2 rounded-lg ${selectedValue === option.value
                                        ? 'bg-primary/10'
                                        : 'bg-transparent'
                                        } ${index < options.length - 1
                                            ? 'border-b border-stone-100 dark:border-gray-600'
                                            : ''
                                        }`}
                                    onPress={() => handleSelect(option.value)}
                                >
                                    <View className="w-8 h-8 items-center justify-center mr-3">
                                        {option.emoji ? (
                                            <Text className="text-lg">{option.emoji}</Text>
                                        ) : (
                                            <Ionicons
                                                name={(option.icon || 'list-outline') as any}
                                                size={20}
                                                color={colors.foreground}
                                            />
                                        )}
                                    </View>
                                    <Text
                                        className={`flex-1 font-dmsans-medium ${selectedValue === option.value
                                            ? 'text-primary'
                                            : 'text-foreground'
                                            }`}
                                    >
                                        {option.label}
                                    </Text>
                                    {selectedValue === option.value && (
                                        <Ionicons name="checkmark" size={20} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

export default Dropdown;