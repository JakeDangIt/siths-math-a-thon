<template>
  <div class="mx-2 md:mx-auto w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
    <StaffPerson v-for="person in staff" :key="person.name" :person="person" />
  </div>
</template>
