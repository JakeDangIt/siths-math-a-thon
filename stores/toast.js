export const useToastStore = defineStore('toast', () => {
  // toast stuff, id is used to trigger the toast component to re-render
  const toastID = ref(0);
  const titleMessage = ref('');
  const descriptionMessage = ref('');

  // change toast message
  function changeToast(title, description) {
    toastID.value++;
    titleMessage.value = title;
    descriptionMessage.value = description;
  }

  return { toastID, titleMessage, descriptionMessage, changeToast };
});
