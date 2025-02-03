<template>
  <div class="flex items-center justify-center gap-2">
    <p>Theme:</p>
    <div>
      <Select v-model="colorMode.preference">
        <SelectTrigger>
          <SelectValue :placeholder="$colorMode.value" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="light"> Light </SelectItem>
            <SelectItem value="bee"> Bee </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>

<script setup>
const colorMode = useColorMode();
</script>
