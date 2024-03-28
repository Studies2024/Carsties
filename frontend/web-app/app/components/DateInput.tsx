import React from "react";
import { UseControllerProps, useController } from "react-hook-form";
import Datepicker, { ReactDatePickerProps } from "react-datepicker";

type Props = {
  label: string;
  type?: string;
  showLabel?: boolean;
} & UseControllerProps &
  Partial<ReactDatePickerProps>;

export default function DateInput(props: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: "" });
  return (
    <div className="block">
      <Datepicker
        {...props}
        {...field}
        onChange={(value) => field.onChange(value)}
        selected={field.value}
        placeholderText={props.label}
        className={`
        rounded-lg w-[100%] flex flex-col
        ${
          fieldState.error
            ? "border-red-500 bg-red-50 text-red-900"
            : !fieldState.invalid && fieldState.isDirty
            ? "border-green-500 bg-green-50 text-green-900"
            : ""
        }
        `}
      />
      {fieldState.error && (
        <div className="text-sm text-red-500 mt-1">
          {fieldState.error.message}
        </div>
      )}
    </div>
  );
}
