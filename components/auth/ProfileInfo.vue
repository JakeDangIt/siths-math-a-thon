<template>
  <!-- if you're logged in, but it should redirect to login -->
  <div v-if="user" class="flex flex-col justify-center gap-8 lg:flex-row">
    <Card class="mx-4 md:mx-auto md:w-4/5 lg:w-1/2">
      <CardHeader class="flex">
        <div class="flex justify-between">
          <!-- header with name and avatar -->
          <div>
            <CardTitle>{{ firstName }}'s Profile</CardTitle>
            <CardDescription
              >Ensure your information is correct.</CardDescription
            >
          </div>

          <Avatar class="h-16 w-16">
            <Avatar class="text-xl">{{ firstName[0] }}</Avatar>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent>
        <!-- details and inputs -->
        <form class="mr-4 flex flex-col">
          <div class="space-y-1">
            <Label for="name">Name</Label>
            <Input
              id="name"
              type="text"
              v-model="newName"
              :placeholder="name"
            />
          </div>

          <div class="space-y-1">
            <Label
              for="osis"
              :class="{
                'text-theme-red': !osisValid && String(newOsis).length > 0,
              }"
            >
              {{
                !osisValid && String(newOsis).length > 0
                  ? 'Please enter a valid OSIS number'
                  : 'OSIS Number'
              }}</Label
            >
            <Input
              id="osis"
              type="number"
              v-model="newOsis"
              :placeholder="osis"
              inputmode="numeric"
              pattern="[0-9]*"
            />
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
      <CardFooter>
        <Button
          @click="updateUser"
          :disabled="
            updateLoading || (String(newOsis).length > 0 && !osisValid)
          "
          >Save</Button
        >
        <HeaderNavLink
          routePath="/auth/updatepassword"
          routeName="Change Password"
          variant="link"
          class="text-md"
        />
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { teachers } from '../../utils/teachers.js';
const user = useSupabaseUser();
const toastStore = useToastStore();

// user info
const name = computed(() => user.value?.user_metadata?.name || '');
const osis = computed(() => user.value?.user_metadata?.osis || '');
const teacher = computed(() => user.value?.user_metadata?.teacher || '');
const grade = computed(() => user.value?.user_metadata?.grade || '');

const firstName = useFirstName(name.value);

// input values
const newName = ref('');
const newOsis = ref('');
const newTeacher = ref('');
const newGrade = ref('');

const osisValid = computed(
  () => String(newOsis.value).length == 9 && !isNaN(Number(newOsis.value))
);



const updateLoading = ref(false);


// update user
async function updateUser() {
  try {
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();

    if (!user.value) {
      throw new Error('Authentication required');
    }

    toastStore.changeToast(
      'Updating user',
      'Please wait while we update your information.'
    );

    // Prepare updated user information (only changed fields)
    const updates = {};
    if (newName.value !== '' && newName.value !== name.value) updates.name = newName.value;
    if (newOsis.value !== '' && newOsis.value !== osis.value) updates.osis = newOsis.value;
    if (newTeacher.value !== '' && newTeacher.value !== teacher.value) updates.teacher = newTeacher.value;
    if (newGrade.value !== '' && newGrade.value !== grade.value) updates.grade = newGrade.value;


    // Update profile if there are changes
    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('uid', user.value.id);

      toastStore.changeToast('Success', 'Your information has been updated');
      
      // Clear input fields
      newName.value = '';
      newOsis.value = '';
      newTeacher.value = '';
      newGrade.value = '';
    } else {
      toastStore.changeToast('No changes', 'No changes were detected to update');
    }
  } catch (error) {
    console.error('Update user error:', error);
    toastStore.changeToast('Error', error.message);
  }
}

</script>
