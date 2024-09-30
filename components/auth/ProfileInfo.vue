<template>
    <!-- if you're logged in, but it should redirect to login -->
    <div v-if="user" class="flex flex-col justify-center gap-8 lg:flex-row">
        <Card class="mx-4 lg:w-1/2">
            <CardHeader class="flex">
                <div class="flex justify-between">
                    <!-- header with name and avatar -->
                    <div>
                        <CardTitle>{{ firstName }}'s Profile</CardTitle>
                        <CardDescription>Ensure your information is correct.</CardDescription>
                    </div>

                    <Avatar v-if="showAvatar" class="h-16 w-16">
                        <AvatarImage :src="avatarImage || avatarStore.avatarImage" draggable="false" />
                    </Avatar>
                    <Avatar v-else class="h-16 w-16">
                        <AvatarFallback class="text-xl">{{ firstName[0] }}</AvatarFallback>
                    </Avatar>
                </div>

                <AuthChangeAvatar @avatarUploaded="handleAvatarUploaded" @avatarRemoval="handleAvatarRemove" />
            </CardHeader>

            <CardContent>
                <!-- details and inputs -->
                <form class="mr-4 flex flex-col">
                    <div class="space-y-1">
                        <Label for="name">Name</Label>
                        <Input id="name" type="text" v-model="newName" :placeholder="name" />
                    </div>

                    <div class="space-y-1">
                        <Label for="osis" :class="{
                            'text-theme-red': !osisValid && String(newOsis).length > 0,
                        }">
                            {{
                                !osisValid && String(newOsis).length > 0
                                    ? 'Please enter a valid OSIS number'
                            : 'OSIS Number'
                            }}</Label>
                        <Input id="osis" type="number" v-model="newOsis" :placeholder="osis" inputmode="numeric"
                            pattern="[0-9]*" />
                    </div>

                    <div class="space-y-1">
                        <Label for="teacher">Teacher</Label>
                        <Select id="teacher" v-model="newTeacher">
                            <SelectTrigger>
                                <SelectValue :placeholder="teacher" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <!-- teachers from the teachers.js -->
                                    <SelectLabel>Teachers</SelectLabel>
                                    <SelectItem v-for="teacher in teachers" :value="teacher.name">
                                        {{ teacher.name }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="space-y-1">
                        <Label for="grade">Grade</Label>
                        <Select id="grade" v-model="newGrade">
                            <SelectTrigger>
                                <SelectValue :placeholder="grade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Grade</SelectLabel>
                                        <SelectItem value="9th"> 9th </SelectItem>
                                        <SelectItem value="10th"> 10th </SelectItem>
                                        <SelectItem value="11th"> 11th </SelectItem>
                                        <SelectItem value="12th"> 12th </SelectItem>
                                    </SelectGroup>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </form>
            </CardContent>

            <!-- button -->
            <CardFooter class="flex justify-between">
                <Button @click="updateUser" :disabled="updateLoading ||
                    (String(newOsis).length > 0 && !osisValid)
                    ">Save</Button>
                <HeaderNavLink routePath="/auth/updatepassword" routeName="Change Password" variant="link"
                    class="text-md flex" />
            </CardFooter>
        </Card>
    </div>
</template>

<script setup>
import { teachers } from '../../utils/teachers.js';
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const avatarStore = useAvatarStore();
const toastStore = useToastStore();

// user info
const name = computed(() => user.value?.user_metadata?.name || '');
const osis = computed(() => user.value?.user_metadata?.osis || '');
const teacher = computed(() => user.value?.user_metadata?.teacher || '');
const grade = computed(() => user.value?.user_metadata?.grade || '');

const firstName = computed(() => {
    const [first] = name.value.split(' ');
    return first
        ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
        : '';
});

// input values
const newName = ref('');
const newOsis = ref('');
const newTeacher = ref('');
const newGrade = ref('');

const osisValid = computed(
    () => String(newOsis.value).length == 9 && !isNaN(Number(newOsis.value))
);

// avatar info
const showAvatar = computed(
    () => avatarStore.avatarImage !== null || avatarImage.value !== ''
);
const avatarFile = ref(null);
const avatarPath = ref('');
const avatarImage = ref('');

const updateLoading = ref(false);

function handleAvatarUploaded(imagePath, file, dataURL) {
    // watch for changes in the avatar path and file (after user uploads a new avatar)
    // this btw is the cropped image path and file
    watch([imagePath, file], ([newPath, newFile]) => {
        avatarPath.value = newPath;
        avatarFile.value = newFile;
        avatarImage.value = dataURL;
    });
}

// remove avatar
function handleAvatarRemove() {
    avatarPath.value = '';
    avatarFile.value = null;
    avatarImage.value = '';
}

// update user
async function updateUser() {
    toastStore.changeToast(
        'Updating user',
        'Please wait while we update your information.'
    );

    // prevent updating to null
    const previousInfo = {
        name: name.value,
        osis: osis.value,
        teacher: teacher.value,
        grade: grade.value,
    };

    // user info thats been updated
    const updates = {
        name: newName.value !== '' ? newName.value : name.value,
        osis: newOsis.value !== '' ? newOsis.value : osis.value,
        teacher: newTeacher.value !== '' ? newTeacher.value : teacher.value,
        grade: newGrade.value !== '' ? newGrade.value : grade.value,
    };

    // if there are no updates in the fields, remove them from the updates object
    Object.entries(updates).forEach(([key, value]) =>
        previousInfo[key] == value ? delete updates[key] : null
    );

    // if there are updates, update the user
    if (Object.values(updates).length > 0 || avatarFile.value) {
        // if avatar changed, update the avatar path and upload file of the avatar (cropped image)
        if (avatarFile.value) {
            // remove the old avatar
            await avatarStore.removeAvatar();

            // set the avatar image and path
            avatarStore.avatarImage = avatarImage.value;
            avatarStore.avatarPath = avatarPath.value;

            // and also store it
            localStorage.setItem('avatarImage', avatarImage.value);
            localStorage.setItem('avatarPath', avatarPath.value);

            updates.avatar = avatarPath.value;

            // just to super clarify, the avatarPath is the generated path of the cropped image and the avatarFile is the file (NOT DATAURL) of the cropped image
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(avatarPath.value, avatarFile.value);
            if (uploadError) {
                toastStore.changeToast('Error uploading avatar', uploadError.message);
                return;
            }
        }

        const { data, error } = await supabase.auth.updateUser({
            data: updates,
        });
        const { error: updateError } = await supabase.from('profiles').update(updates).eq('uid', user.value.id)
        if (error) {
            toastStore.changeToast('Error updating user', error.message);
        } else {
            toastStore.changeToast(
                'User updated',
                'Your information has been updated.'
            );
        }

        // clear all fields
        setTimeout(() => {
            newName.value = '';
            newOsis.value = '';
            newTeacher.value = '';
            newGrade.value = '';
        }, 600);

        updateLoading.value = false;
    } else {
        toastStore.changeToast(
            'No changes made',
            'Please fill out your information to update.'
        );
    }
}
</script>
