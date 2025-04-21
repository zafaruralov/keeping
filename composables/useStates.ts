export const useModalOpen = () => useState("isModalOpen", () => false);

export const closeModal = () => {
  const modal = useModalOpen();
  modal.value = false;
};

export const openModal = () => {
  const modal = useModalOpen();
  modal.value = true;
};

export const toggleModal = () => {
  const modal = useModalOpen();
  modal.value = !modal.value;
};
