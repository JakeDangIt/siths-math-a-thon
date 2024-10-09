export const useAvatarStore = defineStore('avatar', () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  // avatar file info
  const avatarPath = ref('');
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
    avatarPath.value = user.value?.user_metadata?.avatar;
    if (!avatarPath.value) {
      avatarImage.value = null;
      return;
    }

    // download avatar
    const { data, error } = await supabase.storage
      .from('avatars')
      .download(avatarPath.value);

    // create object url of the avatar, used in Avatar.vue and ChangeAvatar.vue
    avatarImage.value = URL.createObjectURL(data);
  }

  // remove avatar
  async function removeAvatar() {
    // delete avatar from storage

    const { data, error } = await supabase.storage
      .from('avatars')
      .remove([avatarPath.value]);

    // update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar: null },
    });

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        avatar: null,
      })
      .eq('uid', user.value.id);

    if (updateError || error) {
      return;
    }

    avatarPath.value = '';
    avatarImage.value = null;

    return true;
  }

  onMounted(async () => {
    await retrieveAvatar();

    // if you log out and log in with a different account, the avatar will be updated
    watch(
      () => user.value,
      async (newUser) => {
        if (avatarPath.value !== newUser?.user_metadata?.avatar) {
          await refreshUser();
          await retrieveAvatar();
        }

        if (!newUser?.user_metadata?.avatar) {
          avatarImage.value = null;
        }
      },
      { immediate: true }
    );
  });

  return { avatarPath, avatarImage, retrieveAvatar, refreshUser, removeAvatar };
});
