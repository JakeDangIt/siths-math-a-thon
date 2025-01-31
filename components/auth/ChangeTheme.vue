<template>
  <div class="flex gap-2 items-center justify-center">
    <p>Color mode:</p>
    <div>
    <Select v-model="colorMode.preference">
      <SelectTrigger>
        <SelectValue :placeholder="$colorMode.value" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="light">
            Light
          </SelectItem>
          <SelectItem value="bee">
            Bee
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
  </div>
</template>

<script setup>
const colorMode = useColorMode()
</script>