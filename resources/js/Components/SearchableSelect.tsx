import React from 'react';
import Select, { Props as SelectProps, GroupBase, StylesConfig } from 'react-select';

interface Option {
    value: string | number;
    label: string;
}

interface SearchableSelectProps extends Omit<SelectProps<Option, boolean, GroupBase<Option>>, 'onChange' | 'value'> {
    value: string | number | (string | number)[] | null;
    onChange: (value: any) => void;
    options: Option[];
    placeholder?: string;
    error?: string;
    label?: string;
    isMulti?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Pilih...',
    error,
    label,
    isMulti = false,
    ...props
}) => {
    // Determine the selected option(s) for react-select
    let selectedOption: Option | Option[] | null = null;
    if (isMulti) {
        if (Array.isArray(value)) {
            selectedOption = options.filter(opt => value.map(String).includes(String(opt.value)));
        } else {
            selectedOption = [];
        }
    } else {
        // Safe comparison bridging numbers and strings
        selectedOption = options.find(opt => String(opt.value) === String(value)) || null;
    }

    const customStyles: StylesConfig<Option, boolean, GroupBase<Option>> = {
        control: (base, state) => ({
            ...base,
            backgroundColor: '#f9fafb', // gray-50
            borderWidth: '0px',
            borderRadius: '0.75rem', // rounded-xl
            paddingTop: '0.45rem',
            paddingBottom: '0.45rem',
            paddingLeft: '0.5rem',
            boxShadow: state.isFocused ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none', // emerald-500/10
            borderColor: state.isFocused ? '#10b981' : '#f3f4f6', // emerald-500 : gray-100
            '&:hover': {
                borderColor: '#10b981',
            },
            transition: 'all 0.2s',
            fontWeight: '900',
            fontSize: '0.875rem',
            color: '#1f2937',
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
        placeholder: (base) => ({
            ...base,
            color: '#d1d5db', // gray-300
            fontWeight: '700',
        }),
        singleValue: (base) => ({
            ...base,
            color: '#111827', // gray-900
            fontWeight: '900',
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#ecfdf5', // emerald-50
            borderRadius: '0.5rem',
            padding: '2px',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#047857', // emerald-700
            fontWeight: '900',
            fontSize: '0.75rem',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#059669', // emerald-600
            ':hover': {
                backgroundColor: '#d1fae5', // emerald-100
                color: '#065f46', // emerald-800
            },
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '1.5rem',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #f3f4f6',
            zIndex: 9999,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            fontWeight: state.isSelected ? '900' : '700',
            fontSize: '0.8125rem',
            padding: '10px 20px',
            '&:active': {
                backgroundColor: '#10b981',
            },
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base) => ({
            ...base,
            color: '#9ca3af',
            '&:hover': {
                color: '#6b7280',
            }
        }),
        input: (base) => ({
            ...base,
            '& input': {
                boxShadow: 'none !important',
                border: 'none !important',
                outline: 'none !important',
            }
        }),
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block mb-1.5 ml-1 text-[10px] font-black text-gray-400 tracking-widest uppercase">
                    {label}
                </label>
            )}
            <Select
                {...props}
                isMulti={isMulti}
                value={selectedOption}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                onChange={(newValue: any) => {
                    if (isMulti) {
                        const selectedValues = newValue ? (newValue as Option[]).map(v => v.value) : [];
                        onChange(selectedValues);
                    } else {
                        if (newValue) {
                            onChange((newValue as Option).value);
                        } else {
                            onChange('');
                        }
                    }
                }}
                options={options}
                placeholder={placeholder}
                styles={customStyles}
                isSearchable={true}
                classNamePrefix="modern-select"
            />
            {error && <p className="mt-2 ml-1 text-[10px] font-bold text-red-600">{error}</p>}
        </div>
    );
};

export default SearchableSelect;
