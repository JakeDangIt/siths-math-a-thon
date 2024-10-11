<template>
  <div class="mx-2 flex justify-center">
    <StaffPerson v-for="person in staff" :key="person.name" :person="person" />
  </div>
</template>
