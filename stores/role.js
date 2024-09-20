export const useRoleStore = defineStore("role", async () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const role = ref("");

  async function getRole() {
    if (user.value) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("uid", user.value.id);
      role.value = data[0].role;
      console.log(role.value);
    }
  }

  onMounted(() => {
    watch(
      user,
      () => {
        getRole();
      },
      { immediate: true }
    );
  })

  return { role };
});
