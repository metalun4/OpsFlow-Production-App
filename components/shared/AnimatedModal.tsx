import React, { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { turkishStrings } from "../../constants/strings";

type AnimatedModalProps = {
  title: string;
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  showConfirmButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  modalStyle?: object;
  contentStyle?: object;
  position?: "bottom" | "center";
};

const AnimatedModal = ({
  title,
  visible,
  onClose,
  onConfirm,
  showConfirmButton = false,
  confirmText = turkishStrings.main.save,
  cancelText = turkishStrings.main.cancel,
  headerRight,
  children,
  modalStyle,
  contentStyle,
  position = "bottom",
}: AnimatedModalProps) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Start animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset animation values if modal is reopened
      fadeAnim.setValue(0);
      slideAnim.setValue(300);

      // Start fade animation for background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Start slide animation for modal content
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  // Handle closing with animation
  const animateClose = (callback?: () => void) => {
    // Fade out background
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // Slide out modal
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (callback) callback();
      onClose();
    });
  };

  const handleConfirm = () => {
    if (onConfirm) {
      animateClose(onConfirm);
    }
  };

  const handleCancel = () => {
    animateClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="none" onRequestClose={handleCancel}>
      <Animated.View
        style={[
          styles.modalBackdrop,
          position === "center" && styles.centeredBackdrop,
          { opacity: fadeAnim },
        ]}
      >
        <Animated.View
          style={[
            styles.modalContent,
            position === "center" && styles.centeredModalContent,
            { transform: [{ translateY: slideAnim }] },
            modalStyle,
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            {headerRight || (
              <Pressable onPress={handleCancel}>
                <FontAwesome5 name="window-close" size={24} color="white" />
              </Pressable>
            )}
          </View>

          <View style={[styles.contentContainer, contentStyle]}>{children}</View>

          {showConfirmButton && (
            <View style={styles.buttonContainer}>
              <Pressable style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>{cancelText}</Text>
              </Pressable>
              <Pressable style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.buttonText}>{confirmText}</Text>
              </Pressable>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredBackdrop: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  centeredModalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  contentContainer: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#4c4c4c",
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});

export default React.memo(AnimatedModal);
