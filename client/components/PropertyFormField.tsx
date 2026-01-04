import React from "react";

interface FormFieldOption {
  value: string;
  label: string;
}

interface PropertyFormFieldProps {
  label: string;
  name: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string | number;
  options?: FormFieldOption[];
  step?: string;
  min?: string | number;
  gridCols?: number; // 그리드 레이아웃용 (2컬럼 등)
}

export default function PropertyFormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  defaultValue,
  options = [],
  step,
  min,
  gridCols,
}: PropertyFormFieldProps) {
  const baseInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e1e5e9",
    borderRadius: 8,
    fontSize: 16,
    color: "#2c3e50",
    background: disabled ? "#f8f9fa" : "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 8,
    fontWeight: 600,
    color: "#2c3e50",
  };

  const containerStyle: React.CSSProperties = gridCols
    ? { marginBottom: 25 }
    : { marginBottom: 25 };

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            name={name}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            defaultValue={defaultValue as string}
            style={{
              ...baseInputStyle,
              minHeight: 120,
              resize: "vertical",
            }}
          />
        );

      case "select":
        return (
          <select
            name={name}
            required={required}
            disabled={disabled}
            defaultValue={defaultValue as string}
            style={baseInputStyle}
          >
            {options.length > 0 ? (
              <>
                <option value="">{placeholder || "선택하세요"}</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </>
            ) : (
              <option value="">{placeholder || "선택하세요"}</option>
            )}
          </select>
        );

      case "number":
        return (
          <input
            name={name}
            type="number"
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            defaultValue={defaultValue as number}
            step={step}
            min={min}
            style={baseInputStyle}
          />
        );

      case "date":
        return (
          <input
            name={name}
            type="date"
            required={required}
            disabled={disabled}
            defaultValue={defaultValue as string}
            style={baseInputStyle}
          />
        );

      default:
        return (
          <input
            name={name}
            type="text"
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            defaultValue={defaultValue as string}
            style={baseInputStyle}
          />
        );
    }
  };

  const content = (
    <>
      <label style={labelStyle}>
        {label} {required && "*"}
      </label>
      {renderInput()}
    </>
  );

  if (gridCols) {
    return (
      <div style={{ ...containerStyle, gridColumn: `span ${gridCols}` }}>
        {content}
      </div>
    );
  }

  return <div style={containerStyle}>{content}</div>;
}

