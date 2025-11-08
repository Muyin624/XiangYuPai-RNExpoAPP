// #region 1. File Banner & TOC
/**
 * BottomPickerModal - 底部选择器弹窗
 * 
 * 功能：
 * - 从底部弹出的选择器
 * - 支持单选/多选
 * - 支持自定义选项列表
 * - 确认/取消操作
 */
// #endregion

// #region 2. Imports
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
// #endregion

// #region 3-7. Types, Constants, Utils, State & Logic
export interface PickerOption {
  label: string;
  value: string | number;
}

interface BottomPickerModalProps {
  visible: boolean;
  title: string;
  options: PickerOption[];
  selectedValue?: string | number;
  onSelect: (value: string | number) => void;
  onCancel: () => void;
}

const COLORS = {
  WHITE: '#FFFFFF',
  BG_GRAY: '#F5F5F5',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#999999',
  BORDER: '#E5E5E5',
  PRIMARY: '#9C27B0',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
} as const;
// #endregion

// #region 8. UI Components & Rendering
const BottomPickerModal: React.FC<BottomPickerModalProps> = ({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          {/* 标题栏 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.placeholder} />
          </View>
          
          {/* 选项列表 */}
          <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
            {options.map((option, index) => {
              const isSelected = option.value === selectedValue;
              const isFirst = index === 0;
              const isLast = index === options.length - 1;
              
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    isFirst && styles.firstOption,
                    isLast && styles.lastOption,
                  ]}
                  onPress={() => {
                    onSelect(option.value);
                    onCancel();
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && <View style={styles.selectedDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  cancelButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 60,
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  placeholder: {
    minWidth: 60,
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  firstOption: {
    marginTop: 8,
  },
  lastOption: {
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  optionTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.PRIMARY,
  },
});

export default BottomPickerModal;
// #endregion

