import React from 'react';
import NumberFormat from 'react-number-format';

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
  props,
  ref
) {
  const { inputRef, onChange, decimalScale = 18, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      allowLeadingZeros={false}
      allowNegative={false}
      decimalScale={decimalScale}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
            float: values.floatValue,
            formattedValue: values.formattedValue,
          },
        });
      }}
      thousandSeparator
    />
  );
});

export default NumberFormatCustom;
