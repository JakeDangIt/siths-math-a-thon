<template>
  <div
    class="mx-auto grid grid-cols-1 gap-2 md:w-2/3 md:grid-cols-2 lg:grid-cols-3"
  >
    <StaffPerson v-for="person in staff" :key="person.name" :person="person" />
  </div>
</template>
