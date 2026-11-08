import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { colors } from '../theme/colors';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  helperText,
  required = false,
  style,
  ...rest
}) => {
  const hasError = Boolean(error);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredStar}>*</Text>}
      </View>

      <TextInput
        style={[
          styles.input,
          hasError && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        accessible={true}
        accessibilityLabel={`${label}${required ? ', obrigatório' : ''}`}
        accessibilityHint={hasError ? `Erro de validação: ${error}` : helperText || undefined}
        aria-invalid={hasError}
        {...rest}
      />

      {hasError ? (
        <Text
          style={styles.errorText}
          accessible={true}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  requiredStar: {
    color: colors.riskCritical,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 46,
  },
  inputError: {
    borderColor: colors.riskCritical,
    backgroundColor: colors.riskCriticalBg,
  },
  errorText: {
    color: colors.riskCritical,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },
});
