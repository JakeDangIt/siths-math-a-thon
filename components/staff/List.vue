<template>
  <div class="mx-auto flex w-full flex-col items-center gap-2 md:w-2/3">
    <h2>For general inquiries, please use contact form.</h2>
    <div class="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
      <StaffPerson
        v-for="person in staff.filter((person) => !person.special)"
        :key="person.name"
        :person="person"
      />
    </div>

    <Separator class="w-2/3" />

    <h2 v-if="staff.some((person) => person.special)">Special Mentions:</h2>
    <div
      v-if="staff.some((person) => person.special)"
      class="grid w-full grid-cols-1 gap-2 md:grid-cols-2"
    >
      <StaffPerson
        v-for="person in staff.filter((person) => person.special)"
        :key="person.name"
        :person="person"
      />
    </div>
  </div>
</template>
