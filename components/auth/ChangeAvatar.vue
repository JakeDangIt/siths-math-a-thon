<template>
  <div class="flex flex-row items-center">
    <!-- image file input for avatar -->
    <div>
      <Label for="uploadAvatar">Upload your avatar</Label>
      <div class="flex flex-col lg:flex-row items-start lg:items-center gap-2">
        <Input
          id="uploadAvatar"
          type="file"
          accept="image/*"
          @change="setImage"
        />
        <Button class="my-1" @click="handleAvatarRemove()" variant="secondary"
          >Remove Avatar</Button
        >
      </div>
    </div>

    <!-- dialog for cropping the image -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="h-fit">
        <!-- Changed the height here -->
        <DialogHeader>
          <DialogTitle>Crop your avatar</DialogTitle>
          <DialogDescription>
            <vue-cropper
              ref="cropper"
              :src="imageUrl"
              :aspect-ratio="1"
              :viewMode="1"
              :img-style="{ height: '65vh' }"
              dragMode="move"
              class="h-full"
            />
          </DialogDescription>
        </DialogHeader>

        <!-- upload (but not actually upload until they save it) -->
        <DialogFooter>
          <Button @click="uploadAvatar">Upload Avatar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
// i use cropperjs library
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

const emit = defineEmits(['avatarUploaded', 'avatarRemoval']);

const avatarStore = useAvatarStore();
const toastStore = useToastStore();
const user = useSupabaseUser();

// cropper for the cropper
const cropper = ref(null);

const isDialogOpen = ref(false);

// some image stuff
const imageUrl = ref('');
const croppedImagePath = ref('');
const croppedImageFile = ref(null);

async function setImage(evt) {
  isDialogOpen.value = true;

  // get the file in the input
  const file = evt.target.files[0];

  // show initial image
  imageUrl.value = URL.createObjectURL(file);
}

function uploadAvatar() {
  // dataURL is the cropped image data (like the actual image itself)
  const croppedImageData = cropper.value
    .getCroppedCanvas()
    .toDataURL('image/jpeg');

  // get the blob of the cropped image
  cropper.value.getCroppedCanvas().toBlob((blob) => {
    // check if the file is too large
    if (blob.size > 5242880) {
      toastStore.changeToast(
        'File too large',
        'Please upload a file smaller than 5MB.'
      );
      return;
    }

    // name/path of the file
    const fileExt = 'jpeg';
    const fileName = `${user.value.id}`;
    const filePath = `${fileName}.${fileExt}`;

    // create a new file of the blob of the cropped image
    croppedImageFile.value = new File([blob], filePath, { type: 'image/jpeg' });
    croppedImagePath.value = filePath;
  }, 'image/jpeg');

  // emit the path and file of the cropped image to ProfileInfo.vue
  emit('avatarUploaded', croppedImagePath, croppedImageFile, croppedImageData);
  isDialogOpen.value = false;
}

// remove avatar
async function handleAvatarRemove() {
  toastStore.changeToast('Removing avatar', 'Please wait...');
  const success = await avatarStore.removeAvatar();
  emit('avatarRemoval');
  if (success) {
    setTimeout(() => {
      toastStore.changeToast('Avatar removed', 'Your avatar has been removed');
    }, 1000);
  }
}
</script>
