<template>
    <div v-if="user">
        <Card>
            <CardHeader>
                <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage v-if="avatarStore.avatarImage" :src="avatarStore.avatarImage" draggable="false"></AvatarImage>
                        <AvatarFallback class="text-lg">{{ firstName[0] }}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-lg font-semibold">{{ user?.user_metadata?.name }}</p>
                        <p className="text-sm text-muted-foreground">{{ user?.user_metadata?.grade }} Grade</p>
                        <div className="mt-2 flex space-x-2">
                            <HomeBadgeTopPercent />
                            <!-- <Badge variant="secondary">
                                <ActivityIcon className="mr-1 h-3 w-3" />
                                Active Streak
                            </Badge>
                            <Badge variant="secondary">
                                <BrainIcon className="mr-1 h-3 w-3" />
                                Math Whiz
                            </Badge> -->
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
const user = useSupabaseUser()
const avatarStore = useAvatarStore()

const name = computed(() => user.value?.user_metadata?.name || '')
const firstName = computed(() => {
    const [first] = name.value.split(' ');
    return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
});
</script>