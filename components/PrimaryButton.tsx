import React from "react";
import { Pressable, Text } from "react-native";

type Props = { title: string; onPress: () => void; disabled?: boolean };

export default function PrimaryButton({ title, onPress, disabled }: Props) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            className={`w-full rounded-2xl items-center justify-center py-3 ${
                disabled ? "bg-zinc-700" : "bg-primary"
            }`}
        >
            <Text className="text-white font-semibold text-base">{title}</Text>
        </Pressable>
    );
}