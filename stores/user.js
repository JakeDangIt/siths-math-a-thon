export const useUserStore = defineStore("user", () => {
  const toastStore = useToastStore();

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  // avatar stuff
  const avatarPath = ref("");
  const avatarImage = ref(null);

  // refresh user data
  async function refreshUser() {
    const { data: updatedUser, error } = await supabase.auth.getUser();

    user.value = updatedUser.user;
    avatarPath.value = updatedUser.user?.user_metadata?.avatar;

    return updatedUser.user;
  }

  // retrieve avatar
  async function retrieveAvatar() {
    if (!avatarPath.value) return;

    // download avatar
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(avatarPath.value);

    // create object url of the avatar, used in Avatar.vue and ChangeAvatar.vue
    avatarImage.value = URL.createObjectURL(data);
  }

  async function removeAvatar() {
    // delete avatar from storage
    
    const { data, error } = await supabase.storage
      .from("avatars")
      .remove([avatarPath.value]);

    // update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar: null },
    });

    if (updateError || error) {
      return
    }

    avatarPath.value = "";
    avatarImage.value = null;

    // remove avatar from local storage
    localStorage.removeItem("avatarImage");
    localStorage.removeItem("avatarPath");

    return true;
  }

  onMounted(async () => {
    // retrieve avatar from local storage, so you dont have to re-download it and saves time before it refreshes user
    avatarImage.value = localStorage.getItem("avatarImage");
    avatarPath.value = localStorage.getItem("avatarPath");

    // refresh user data then retrieve avatar if it has changed
    if (avatarPath.value !== user.value?.user_metadata?.avatar) {
      await refreshUser();
      await retrieveAvatar();
    }
  });

  return { avatarPath, avatarImage, retrieveAvatar, refreshUser, removeAvatar };
});
