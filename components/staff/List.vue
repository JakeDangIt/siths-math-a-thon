<template>
  <div class="w-full md:w-2/3 mx-auto flex flex-col items-center gap-2">
    <h2>For general inquiries, please use contact form.</h2>
    <div class="w-full grid grid-cols-1 gap-2 md:grid-cols-2">
      <StaffPerson v-for="person in staff.filter((person) => !person.special)" :key="person.name" :person="person" />
    </div>

    <Separator class="w-2/3" />
    
    <h2 v-if="staff.some((person) => person.special)">Special Mentions:</h2>
    <div v-if="staff.some((person) => person.special)" class="w-full grid grid-cols-1 gap-2 md:grid-cols-2">
      <StaffPerson v-for="person in staff.filter((person) => person.special)" :key="person.name" :person="person" />
    </div>
  </div>
</template>
