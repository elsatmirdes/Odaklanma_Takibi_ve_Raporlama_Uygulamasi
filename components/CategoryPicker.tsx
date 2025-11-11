import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import {CATEGORIES} from "../src/constants/categories"

// import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Picker } from "@react-native-picker/picker";
import { View, Text, StyleSheet } from "react-native";

import { Input, FormControl, InputLabel } from '@mui/material';

interface SelectOtherPropsProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function SelectOtherProps({ value, onChange, disabled }: SelectOtherPropsProps)  {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Kategori Seçimi</Text>
            <View style={[styles.pickerContainer, disabled && styles.disabled]}>
                <Picker
                    selectedValue={value}
                    onValueChange={(val) => onChange(val)}
                    enabled={!disabled}
                    mode="dropdown"
                >
                    {CATEGORIES.map((cat) => (
                        <Picker.Item key={cat} label={cat} value={cat} />
                    ))}
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        width: "90%",
        alignSelf: "center",
    },
    label: {
        fontWeight: "600",
        marginBottom: 6,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        overflow: "hidden",
    },
    disabled: {
        opacity: 0.6,
    },
});