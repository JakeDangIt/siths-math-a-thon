<template>
    <div class="w-2/3 grid grid-cols-4 gap-4">
        <MinigamesConnectionsCard 
            v-for="(connection, index) in connections" 
            :key="index" 
            :connection="connection" 
        />
    </div>
</template>

<script setup>
import { connections } from '~/utils/connections';
</script>
