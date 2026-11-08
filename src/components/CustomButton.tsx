import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  iconName,
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText,
          indicator: colors.primary,
        };
      case 'danger':
        return {
          container: styles.dangerContainer,
          text: styles.dangerText,
          indicator: '#FFFFFF',
        };
      case 'outline':
        return {
          container: styles.outlineContainer,
          text: styles.outlineText,
          indicator: colors.primary,
        };
      case 'primary':
      default:
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
          indicator: '#FFFFFF',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { container: styles.smContainer, text: styles.smText, iconSize: 16 };
      case 'lg':
        return { container: styles.lgContainer, text: styles.lgText, iconSize: 22 };
      case 'md':
      default:
        return { container: styles.mdContainer, text: styles.mdText, iconSize: 18 };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={[
        styles.baseContainer,
        vStyles.container,
        sStyles.container,
        disabled && styles.disabledContainer,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={vStyles.indicator} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {iconName && (
            <MaterialCommunityIcons
              name={iconName}
              size={sStyles.iconSize}
              color={disabled ? colors.textMuted : (textStyle?.color as string) || vStyles.text.color}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.baseText,
              vStyles.text,
              sStyles.text,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // WCAG touch target guideline
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryContainer: {
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  secondaryText: {
    color: colors.accentDark,
  },
  dangerContainer: {
    backgroundColor: colors.riskCritical,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  disabledContainer: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
  },
  disabledText: {
    color: '#94A3B8',
  },
  smContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 36,
  },
  smText: {
    fontSize: 13,
  },
  mdContainer: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  mdText: {
    fontSize: 14,
  },
  lgContainer: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  lgText: {
    fontSize: 16,
  },
});
