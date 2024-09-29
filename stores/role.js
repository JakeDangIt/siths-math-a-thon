export const useRoleStore = defineStore('role', () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const role = ref('');

  async function getRole() {
    if (user.value) {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('uid', user.value.id);

      if (data && data.length > 0) {
        role.value = data[0].role;
      } else {
        console.error('Error fetching role:', error);
      }
    } else {
      role.value = 'member';
    }
  }

  watch(
    user,
    async () => {
      await getRole();
    },
    { immediate: true }
  );

  return { role, getRole };
});
