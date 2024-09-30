<template>
  <!-- link to file -->
  <div>
    <a
      class="text-md underline hover:bg-theme-dark-blue hover:bg-opacity-20"
      :href="fileUrl"
      target="_blank"
      >{{ fileUrl ? file.name : 'Loading...' }}</a
    >
  </div>
</template>

<script setup>
const props = defineProps(['file']);

const supabase = useSupabaseClient();
const toastStore = useToastStore();

const file = props.file;
const fileUrl = ref(null);

// get the file url
function getFileUrl() {
  const { data, error } = supabase.storage
    .from('archive')
    .getPublicUrl(file.name);
  if (error) {
    toastStore.changeToast('Error getting file', error.message);
  }
  fileUrl.value = data.publicUrl;
}

// get the file url on mount
onMounted(() => {
  getFileUrl();
});
</script>
