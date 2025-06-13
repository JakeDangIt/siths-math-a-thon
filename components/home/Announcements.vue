<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center justify-between">
        Latest Announcements
        <Button
          variant="outline"
          size="sm"
          @click="showAllDialog = true"
          class="ml-auto"
        >
          View All
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div
        v-if="latestAnnouncements.length === 0"
        class="py-8 text-center text-muted-foreground"
      >
        <MessageSquare class="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p>No announcements yet</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="announcement in latestAnnouncements"
          :key="announcement.id"
          class="flex items-start space-x-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
        >
          <div class="mt-1 flex-shrink-0">
            <div class="h-2 w-2 rounded-full bg-primary"></div>
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="mb-1 text-sm font-medium text-foreground">
              {{ announcement.title }}
            </h4>
            <p class="mb-2 line-clamp-2 text-sm text-muted-foreground">
              {{ announcement.content }}
            </p>
            <div class="flex items-center text-xs text-muted-foreground">
              <Calendar class="mr-1 h-3 w-3" />
              {{ formatDate(announcement.created_at) }}
            </div>
          </div>
        </div>
      </div>
    </CardContent>

    <!-- All Announcements Dialog -->
    <Dialog v-model:open="showAllDialog">
      <DialogContent class="max-h-[80vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>All Announcements</DialogTitle>
          <DialogDescription>
            View all store announcements and updates
          </DialogDescription>
        </DialogHeader>

        <ScrollArea class="max-h-[60vh] pr-4">
          <div
            v-if="allAnnouncements.length === 0"
            class="py-8 text-center text-muted-foreground"
          >
            <MessageSquare class="mx-auto mb-4 h-16 w-16 opacity-50" />
            <p class="mb-2 text-lg font-medium">No announcements</p>
            <p class="text-sm">Check back later for updates</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="announcement in allAnnouncements"
              :key="announcement.id"
              class="rounded-lg border bg-card p-4"
            >
              <div class="mb-3 flex items-start justify-between">
                <h3 class="text-lg font-semibold text-foreground">
                  {{ announcement.title }}
                </h3>
              </div>

              <p class="mb-3 whitespace-pre-wrap text-muted-foreground">
                {{ announcement.content }}
              </p>

              <div
                class="flex items-center justify-between text-sm text-muted-foreground"
              >
                <div class="flex items-center">
                  <Calendar class="mr-1 h-4 w-4" />
                  {{ formatDate(announcement.created_at) }}
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
import { Calendar, MessageSquare, User } from 'lucide-vue-next';

// Get the activity store
const announcementStore = useAnnouncementsStore();

// Dialog state
const showAllDialog = ref(false);

// Replace this with your actual announcements from the store
const allAnnouncements = computed(
  () => announcementStore.announcementsData || []
);

// Get the latest 3 announcements
const latestAnnouncements = computed(() =>
  allAnnouncements.value
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
);

// Format date helper
const formatDate = (date) => {
  const now = new Date();
  const announcementDate = new Date(date);
  const diffTime = Math.abs(now - announcementDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays <= 7) {
    return `${diffDays} days ago`;
  } else {
    return announcementDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};
</script>
