export const useRoleStore = defineStore('role', () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const role = ref('');

	// function that gets the user's profile's role, should be member by default, logged in or not
  async function getRole() {
    if (user.value) {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('uid', user.value.id);

      if (data && data.length > 0) {
        role.value = data[0].role;
      } else {
	      role.value = 'member';
      }
    } 
    else {
      role.value = 'member';
    }
  }
	
  // on log in and out, get role again
  watch(
    user,
    async () => {
      await getRole();
    },
    { immediate: true }
  );

  return { role, getRole };
});
