import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import {CATEGORIES} from "../src/constants/categories"

import Select, { SelectChangeEvent } from '@mui/material/Select';
import {View} from "react-native";
import { Input, FormControl, InputLabel } from '@mui/material';

export default function SelectOtherProps() {
    const [categorie, setCategories] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setCategories(event.target.value);
    };

    return (
        <View>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={categorie}
                    label="Kategori"
                    onChange={handleChange}
                >

                    {CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}


                </Select>
            </FormControl>
        </View>
    );
}