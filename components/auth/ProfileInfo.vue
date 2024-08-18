<script setup>
import { teachers } from '../../utils/teachers'
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const userStore = useUserStore()
const toastStore = useToastStore()

// user info
const name = computed(() => user.value?.user_metadata?.name || '')
const email = computed(() => user.value?.email || '')
const osis = computed(() => user.value?.user_metadata?.osis || '')
const teacher = computed(() => user.value?.user_metadata?.teacher || '')
const grade = computed(() => user.value?.user_metadata?.grade || '')

const firstName = computed(() => {
    const [first] = name.value.split(' ');
    return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
});

// input values
const newName = ref('')
const newEmail = ref('')
const emailValid = computed(() => newEmail.value.includes('@nycstudents.net'))
const newOsis = ref('')
const newTeacher = ref('')
const newGrade = ref('')

// avatar info
const showAvatar = computed(() => userStore.avatarImage !== null || avatarImage.value !== '')
const avatarFile = ref(null)
const avatarPath = ref('')
const avatarImage = ref('')

const updateLoading = ref(false)


function handleAvatarUploaded(imagePath, file, dataURL) {
    // watch for changes in the avatar path and file (after user uploads a new avatar)
    // this btw is the cropped image path and file
    watch([imagePath, file], ([newPath, newFile]) => {
        avatarPath.value = newPath
        avatarFile.value = newFile
        avatarImage.value = dataURL
    })
}

function handleAvatarRemove() {
    avatarPath.value = ''
    avatarFile.value = null
    avatarImage.value = ''
}

async function updateUser() {
    toastStore.changeToast('Updating user', 'Please wait while we update your information.')

    // prevent updating to null
    const previousInfo = {
        name: name.value,
        osis: osis.value,
        teacher: teacher.value,
        grade: grade.value
    }

    // user info thats been updated
    const updates = {
        name: newName.value !== '' ? newName.value : name.value,
        osis: newOsis.value !== '' ? newOsis.value : osis.value,
        teacher: newTeacher.value !== '' ? newTeacher.value : teacher.value,
        grade: newGrade.value !== '' ? newGrade.value : grade.value
    }

    // if there are no updates in the fields, remove them from the updates object
    Object.entries(updates).forEach(([key, value]) => previousInfo[key] == value ? delete updates[key] : null)

    // if there are updates, update the user
    if (Object.values(updates).length > 0 || avatarFile.value) {

        // if avatar changed, update the avatar path and upload file of the avatar (cropped image)
        if (avatarFile.value) {
            // remove the old avatar
            await userStore.removeAvatar()

            // set the avatar image and path
            userStore.avatarImage = avatarImage.value;
            userStore.avatarPath = avatarPath.value;

            // and also store it
            localStorage.setItem("avatarImage", avatarImage.value);
            localStorage.setItem("avatarPath", avatarPath.value);

            updates.avatar = avatarPath.value

            // just to super clarify, the avatarPath is the generated path of the cropped image and the avatarFile is the file (NOT DATAURL) of the cropped image
            const { error: uploadError } = await supabase.storage.from('avatars').upload(avatarPath.value, avatarFile.value)
            if (uploadError) {
                toastStore.changeToast('Error uploading avatar', uploadError.message)
                return
            }
        }

        const { data, error } = await supabase.auth.updateUser({
            email: newEmail.value ? newEmail.value : email.value,
            data: updates
        })
        if (error) {
            toastStore.changeToast('Error updating user', error.message)
        } else {
            setTimeout(() => {
                toastStore.changeToast('User updated', newEmail.value !== '' ? 'Your information has been updated. Please confirm your email change.' : 'Your information has been updated.')
            }, 600);
        }

        // Clear all fields
        newName.value = ''
        newEmail.value = ''
        newOsis.value = ''
        newTeacher.value = ''
        newGrade.value = ''

        updateLoading.value = false
    } else {
        toastStore.changeToast('No changes made', 'Please fill out your information to update.')
    }
}
</script>

<template>
    <div v-if="user" class="flex flex-col lg:flex-row justify-center gap-8 mt-[20px]">
        <Card class="mx-4 lg:w-1/3">
            <CardHeader class="flex">
                <div class="flex justify-between">
                    <div>
                        <CardTitle>{{ firstName }}'s Profile</CardTitle>
                        <CardDescription>Ensure your information is correct.</CardDescription>
                    </div>
                    <Avatar v-if="showAvatar" class="h-16 w-16">
                        <AvatarImage :src="avatarImage || userStore.avatarImage" draggable="false" />
                    </Avatar>
                    <Avatar v-else class="h-16 w-16">
                        <AvatarFallback class="text-xl">{{ firstName[0] }}</AvatarFallback>
                    </Avatar>
                </div>
                <AuthChangeAvatar @avatarUploaded="handleAvatarUploaded" @avatarRemoval="handleAvatarRemove" />
            </CardHeader>

            <CardContent>
                <form class="mr-4 flex flex-col">
                    <div class="space-y-1">
                        <Label for="name">Name</Label>
                        <Input id="name" type="text" v-model="newName" :placeholder="name" />
                    </div>
                    <div class="space-y-1">
                        <Label for="email" :class="{ 'text-theme-red': !emailValid && newEmail.length > 0 }">{{
                            !emailValid && newEmail.length > 0
                                ? 'Please enter a valid NYCDOE email' : 'Email (NYCDOE)' }} </Label>
                        <Input id="email" type="email" v-model="newEmail" :placeholder="email" />
                    </div>
                    <div class="space-y-1">
                        <Label for="osis">OSIS Number</Label>
                        <Input id="osis" type="tel" v-model="newOsis" :placeholder="osis" inputmode="numeric"
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
                                    <SelectLabel>Teachers</SelectLabel>
                                    <SelectItem v-for="teacher in teachers" :value="teacher.value">
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
                                    <SelectLabel>Grade</SelectLabel>
                                    <SelectGroup>
                                        <SelectLabel>Grade</SelectLabel>
                                        <SelectItem value="9">
                                            9th
                                        </SelectItem>
                                        <SelectItem value="10">
                                            10th
                                        </SelectItem>
                                        <SelectItem value="11">
                                            11th
                                        </SelectItem>
                                        <SelectItem value="12">
                                            12th
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </form>
            </CardContent>

            <CardFooter class="flex justify-between">
                <Button @click="updateUser" :disabled="updateLoading">Save</Button>
                <HeaderNavLink routePath="/auth/updatepassword" routeName="Change Password" variant="link"
                    class="flex text-md" />
            </CardFooter>
        </Card>
    </div>
</template>