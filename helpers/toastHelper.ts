import Toast from "react-native-toast-message";

export const showToast = (type: any, title: any, message: any) => {
  Toast.show({
    type: type || "success",
    text1: title,
    text2: message,
    position: "bottom", 
    visibilityTime: 3000, 
    autoHide: true,
  });
};