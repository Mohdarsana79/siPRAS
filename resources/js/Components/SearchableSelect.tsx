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
            backgroundColor: '#ffffff',
            borderWidth: '1px',
            borderRadius: '0.375rem',
            paddingTop: '2px',
            paddingBottom: '2px',
            paddingLeft: '4px',
            boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
            borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
            '&:hover': {
                borderColor: '#6366f1',
            },
            transition: 'all 0.2s',
            fontWeight: '500',
            fontSize: '0.875rem',
            color: '#111827',
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
        placeholder: (base) => ({
            ...base,
            color: '#9ca3af',
            fontWeight: '400',
        }),
        singleValue: (base) => ({
            ...base,
            color: '#111827',
            fontWeight: '500',
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#f3f4f6',
            borderRadius: '0.375rem',
            padding: '1px',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#374151',
            fontWeight: '600',
            fontSize: '0.75rem',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#6b7280',
            ':hover': {
                backgroundColor: '#e5e7eb',
                color: '#111827',
            },
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '0.375rem',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            border: '1px solid #e5e7eb',
            zIndex: 9999,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? '#f3f4f6' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            fontWeight: state.isSelected ? '600' : '400',
            fontSize: '0.8125rem',
            padding: '8px 16px',
            '&:active': {
                backgroundColor: '#6366f1',
            },
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base) => ({
            ...base,
            color: '#9ca3af',
            '&:hover': {
                color: '#4b5563',
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
