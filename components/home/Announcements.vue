<template>
    <Card>
        <CardHeader>
            <CardTitle class="flex items-center justify-between">
                Latest Announcements
                <Button variant="outline" size="sm" @click="showAllDialog = true" class="ml-auto">
                    View All
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div v-if="latestAnnouncements.length === 0" class="text-center py-8 text-muted-foreground">
                <MessageSquare class="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No announcements yet</p>
            </div>

            <div v-else class="space-y-4">
                <div v-for="announcement in latestAnnouncements" :key="announcement.id"
                    class="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div class="flex-shrink-0 mt-1">
                        <div class="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-medium text-foreground mb-1">
                            {{ announcement.title }}
                        </h4>
                        <p class="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {{ announcement.content }}
                        </p>
                        <div class="flex items-center text-xs text-muted-foreground">
                            <Calendar class="w-3 h-3 mr-1" />
                            {{ formatDate(announcement.created_at) }}
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>

        <!-- All Announcements Dialog -->
        <Dialog v-model:open="showAllDialog">
            <DialogContent class="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>All Announcements</DialogTitle>
                    <DialogDescription>
                        View all store announcements and updates
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea class="max-h-[60vh] pr-4">
                    <div v-if="allAnnouncements.length === 0" class="text-center py-8 text-muted-foreground">
                        <MessageSquare class="mx-auto h-16 w-16 mb-4 opacity-50" />
                        <p class="text-lg font-medium mb-2">No announcements</p>
                        <p class="text-sm">Check back later for updates</p>
                    </div>

                    <div v-else class="space-y-4">
                        <div v-for="announcement in allAnnouncements" :key="announcement.id"
                            class="p-4 rounded-lg border bg-card">
                            <div class="flex items-start justify-between mb-3">
                                <h3 class="text-lg font-semibold text-foreground">
                                    {{ announcement.title }}
                                </h3>
                            </div>

                            <p class="text-muted-foreground mb-3 whitespace-pre-wrap">
                                {{ announcement.content }}
                            </p>

                            <div class="flex items-center justify-between text-sm text-muted-foreground">
                                <div class="flex items-center">
                                    <Calendar class="w-4 h-4 mr-1" />
                                    {{ formatDate(announcement.createdAt) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" @click="showAllDialog = false">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Card>
</template>

<script setup>
import { Calendar, MessageSquare, User } from 'lucide-vue-next'

// Get the activity store
const announcementStore = useAnnouncementsStore()

// Dialog state
const showAllDialog = ref(false)

// Replace this with your actual announcements from the store
const allAnnouncements = computed(() => announcementStore.announcementsData || [])

// Get the latest 3 announcements
const latestAnnouncements = computed(() =>
    allAnnouncements.value
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
)

// Format date helper
const formatDate = (date) => {
    const now = new Date()
    const announcementDate = new Date(date)
    const diffTime = Math.abs(now - announcementDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
        return 'Yesterday'
    } else if (diffDays <= 7) {
        return `${diffDays} days ago`
    } else {
        return announcementDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }
}
</script>